#!/usr/bin/env node
/**
 * Backfills leads recovered from admin emails into Zoho CRM.
 *
 *   node scripts/parse-lead-emails.mjs ./exported-emails > recovered-leads.csv
 *   node scripts/import-leads-to-zoho.mjs recovered-leads.csv            # dry run
 *   node scripts/import-leads-to-zoho.mjs recovered-leads.csv --commit   # writes
 *
 * Dedupes on Email: if a lead with that address already exists in Zoho the row is
 * SKIPPED and nothing about the existing record is touched. This deliberately uses
 * insert (`POST /Leads`) rather than `Leads/upsert`, because upsert would overwrite
 * live records that sales may have already edited.
 *
 * Field mapping follows this org's layout, which is not what the labels suggest:
 *   Name1     <- student name        (the column labelled "Name")
 *   Last_Name <- home state          (the mandatory field, labelled "Home State")
 * See lib/zoho-crm.ts for the verified list of writable API names.
 */

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const COMMIT = process.argv.includes('--commit');
const CSV = process.argv[2];

function loadEnv() {
  const file = path.join(process.cwd(), '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    if (!process.env[key]) process.env[key] = trimmed.slice(idx + 1).trim();
  }
}

// Must run before the module-level config below: consts capture process.env once, so
// loading .env later (from main) would silently ignore every value set there.
loadEnv();

const FORM_NAME = process.env.RECOVERY_FORM_NAME || 'Email Recovery';

/** Deliberately strict: a typo'd address is reported here rather than rejected by Zoho. */
const isValidEmail = (value) => /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(String(value || '').trim());

/** Minimal RFC 4180 reader — the CSV is ours, but students put commas in college names. */
export function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }

  const headers = rows.shift() || [];
  return rows
    .filter((r) => r.some((c) => c.trim()))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h.trim(), (r[i] || '').trim()])));
}

async function getAccessToken() {
  const accountsUrl = (process.env.ZOHO_CRM_ACCOUNTS_URL || 'https://accounts.zoho.com/oauth/v2/token').trim();
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: (process.env.ZOHO_CRM_REFRESH_TOKEN || '').trim(),
    client_id: (process.env.ZOHO_CRM_CLIENT_ID || '').trim(),
    client_secret: (process.env.ZOHO_CRM_CLIENT_SECRET || '').trim(),
  });

  if (!params.get('refresh_token')) {
    throw new Error('ZOHO_CRM_REFRESH_TOKEN is not set — see the header of lib/zoho-crm.ts for how to generate one');
  }

  const res = await fetch(accountsUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const raw = await res.text();
  let payload = null;
  try { payload = JSON.parse(raw); } catch { /* non-JSON body is reported below */ }

  if (!payload?.access_token) {
    throw new Error(`token request failed (status ${res.status}): ${raw.slice(0, 300)}`);
  }
  return payload.access_token;
}

const BASE = (process.env.ZOHO_CRM_API_BASE_URL || 'https://www.zohoapis.com/crm/v8').trim().replace(/\/$/, '');

/** How many addresses to pack into a single search query. Zoho caps criteria length. */
const EMAIL_LOOKUP_BATCH = 25;
/** Zoho accepts at most 100 records per insert call. */
const INSERT_BATCH = 100;

/** Returns the existing lead id for one address, or null. Fallback for the bulk path. */
async function findByEmail(token, email) {
  const res = await fetch(`${BASE}/Leads/search?email=${encodeURIComponent(email)}`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });

  if (res.status === 204) return null; // Zoho's "no match"
  if (!res.ok) throw new Error(`search failed (${res.status}): ${(await res.text()).slice(0, 200)}`);

  const body = await res.json().catch(() => null);
  return body?.data?.[0]?.id || null;
}

/**
 * Looks up many addresses at once with a single `(Email:in:a,b,c)` search per batch,
 * turning N calls into N/25.
 *
 * Falls back to one-at-a-time lookups for any batch Zoho rejects, so a stricter API
 * version or a missing operator degrades to slower-but-correct instead of wrong. Being
 * wrong here means inserting a duplicate over a live record.
 */
async function findExistingEmails(token, emails) {
  const existing = new Map(); // lowercased email -> lead id
  const unique = [...new Set(emails.map((e) => e.trim()).filter(Boolean))];
  let calls = 0;

  for (let i = 0; i < unique.length; i += EMAIL_LOOKUP_BATCH) {
    const batch = unique.slice(i, i + EMAIL_LOOKUP_BATCH);
    const criteria = `(Email:in:${batch.join(',')})`;
    const url = `${BASE}/Leads/search?criteria=${encodeURIComponent(criteria)}&fields=Email&per_page=200`;

    let handled = false;

    try {
      calls++;
      const res = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });

      if (res.status === 204) {
        handled = true; // none of this batch exists
      } else if (res.ok) {
        const body = await res.json().catch(() => null);
        for (const record of body?.data || []) {
          if (record?.Email) existing.set(String(record.Email).toLowerCase(), record.id);
        }
        handled = true;
      } else {
        console.error(
          `  ! bulk lookup rejected (${res.status}): ${(await res.text()).slice(0, 160)}\n` +
          '    falling back to one lookup per address for this batch'
        );
      }
    } catch (err) {
      console.error(`  ! bulk lookup failed (${err.message}); falling back for this batch`);
    }

    if (!handled) {
      for (const email of batch) {
        try {
          calls++;
          const id = await findByEmail(token, email);
          if (id) existing.set(email.toLowerCase(), id);
        } catch (err) {
          // Re-thrown: silently treating a lookup failure as "absent" would insert a
          // duplicate over a record that already exists.
          throw new Error(`lookup failed for ${email}: ${err.message}`);
        }
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  return { existing, calls };
}

export function toLead(row) {
  const lead = {
    // This layout stores the home state in the mandatory Last_Name field.
    Last_Name: row.home_state || 'Unknown',
    Name1: row.name || '',
    Email: row.email,
    Platform: 'Web',
    Form_Name: FORM_NAME,
  };

  if (row.mobile) lead.Phone = row.mobile;

  if (row.preferred_colleges) {
    // Semicolons, not commas — college names contain commas ("St. John's, Bangalore").
    // Zoho rejects single-line text over 255 chars, so keep whole names and mark the cut.
    const joined = row.preferred_colleges.split(/\s*\|\s*/).filter(Boolean).join('; ');
    lead.College_Name = joined.length > 255 ? `${joined.slice(0, 252).replace(/;?\s*[^;]*$/, '')}…` : joined;
  }

  // Integer field: omit entirely rather than sending '' when there is no rank.
  const rank = parseInt(String(row.neet_rank).replace(/\D/g, ''), 10);
  if (Number.isFinite(rank)) lead.Neet_Rank = rank;

  return lead;
}

/**
 * Inserts one lead or many. A lone object is wrapped, so the bulk path is the only path.
 * Results come back in input order — Zoho's response array is positional — so a partial
 * failure still reports precisely which rows landed.
 */
async function insertLead(token, leads) {
  const records = Array.isArray(leads) ? leads : [leads];
  const results = [];

  for (let i = 0; i < records.length; i += INSERT_BATCH) {
    const batch = records.slice(i, i + INSERT_BATCH);
    let data = [];

    try {
      const res = await fetch(`${BASE}/Leads`, {
        method: 'POST',
        headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: batch, trigger: ['workflow'] }),
      });

      // Zoho answers a partially failed batch with non-2xx AND a per-record array,
      // so the body is read regardless of status.
      const body = await res.json().catch(() => null);
      data = Array.isArray(body?.data) ? body.data : [];

      if (!data.length) {
        throw new Error(`status ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);
      }
    } catch (err) {
      batch.forEach(() => results.push({ success: false, id: null, message: err.message }));
      continue;
    }

    batch.forEach((_, j) => {
      const record = data[j];
      const success = String(record?.status || '').toLowerCase() === 'success';
      results.push({
        success,
        id: success ? String(record?.details?.id ?? '') || null : null,
        code: record?.code,
        message: record?.message,
      });
    });

    if (i + INSERT_BATCH < records.length) await new Promise((r) => setTimeout(r, 500));
  }

  return results;
}

async function main() {
  if (!CSV) {
    console.error('usage: node scripts/import-leads-to-zoho.mjs <recovered-leads.csv> [--commit]');
    process.exit(1);
  }

  const rows = parseCSV(fs.readFileSync(CSV, 'utf8'));
  console.log(`${rows.length} rows in ${CSV}`);
  console.log(COMMIT ? '*** COMMIT MODE — writing to Zoho ***\n' : '--- DRY RUN (pass --commit to write) ---\n');

  const token = await getAccessToken();
  const summary = { created: 0, skipped: 0, failed: 0 };

  const invalid = rows.filter((r) => !isValidEmail(r.email));
  const usable = rows.filter((r) => isValidEmail(r.email));

  for (const row of invalid) {
    console.log(`SKIP-BAD  ${row.name || '(no name)'}  unusable email address: ${JSON.stringify(row.email || '')}`);
    summary.failed++;
  }

  // Phase 1 — one lookup per 25 addresses instead of one per row.
  const planned = Math.ceil(new Set(usable.map((r) => r.email.trim())).size / EMAIL_LOOKUP_BATCH);
  console.log(`checking ${usable.length} addresses against the CRM in ${planned} request(s) ...`);
  const { existing, calls: lookups } = await findExistingEmails(token, usable.map((r) => r.email));

  // Phase 2 — partition, preserving CSV order for a readable report.
  const toCreate = [];
  for (const row of usable) {
    const existingId = existing.get(row.email.trim().toLowerCase());
    if (existingId) {
      console.log(`SKIP      ${row.email}  already in CRM (${existingId})`);
      summary.skipped++;
    } else {
      toCreate.push(row);
    }
  }

  if (!toCreate.length) {
    console.log('\nnothing new to insert.');
    return;
  }

  // Phase 3 — one insert call per 100 new leads.
  const leads = toCreate.map(toLead);

  if (!COMMIT) {
    for (const [i, lead] of leads.entries()) console.log(`CREATE    ${toCreate[i].email}  ${JSON.stringify(lead)}`);
    console.log(
      `\nwould create: ${leads.length}   skipped (already present): ${summary.skipped}   ` +
      `failed: ${summary.failed}\n` +
      `API calls: ${lookups} lookup + ${Math.ceil(leads.length / INSERT_BATCH)} insert ` +
      `(vs ${usable.length * 2} one-at-a-time)`
    );
    return;
  }

  console.log(`\ninserting ${leads.length} lead(s) in ${Math.ceil(leads.length / INSERT_BATCH)} request(s) ...`);
  const results = await insertLead(token, leads);

  results.forEach((result, i) => {
    const email = toCreate[i]?.email;
    if (result.success) {
      console.log(`CREATED   ${email}  ${result.id}`);
      summary.created++;
    } else {
      console.log(`FAILED    ${email}  ${result.code || ''} ${result.message || ''}`.trimEnd());
      summary.failed++;
    }
  });

  console.log(
    `\ncreated: ${summary.created}   skipped (already present): ${summary.skipped}   failed: ${summary.failed}`
  );
  if (summary.failed) process.exitCode = 1;
}

// Only run when invoked directly, so the pure helpers above stay unit-testable.
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((err) => {
    console.error(`\nfatal: ${err.message}`);
    process.exit(1);
  });
}
