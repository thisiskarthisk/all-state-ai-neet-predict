#!/usr/bin/env node
/**
 * Recovers lead data from the admin notification emails sent by
 * `app/api/counselling/send-email/route.ts`, and writes them to a CSV for review.
 *
 * Source-agnostic: point it at a directory of `.eml` files (every mail client can
 * export those — Gmail: "Show original" → "Download Original") or of raw `.html`
 * bodies. Nested directories are walked.
 *
 *   node scripts/parse-lead-emails.mjs ./exported-emails > recovered-leads.csv
 *
 * Only ADMIN copies are parsed. The student receives a near-identical mail, so
 * subjects are the discriminator:
 *   admin   -> "Student Admission Profile - <name>"
 *   student -> "Student Admission Profile" / "... Confirmation"
 * Parsing both would double-count every lead.
 */

import fs from 'fs';
import path from 'path';

const ADMIN_SUBJECT = /^Student Admission Profile\s+-\s+/i;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(eml|html?|txt)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

/** Decodes quoted-printable, which is how most clients encode these HTML bodies. */
function decodeQuotedPrintable(input) {
  return input
    .replace(/=\r?\n/g, '')
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/** Splits a message (or MIME part) into its header block and body at the first blank line. */
function splitHeaders(raw) {
  const match = raw.match(/\r?\n\r?\n/);
  if (!match) return { head: raw, body: '' };
  return { head: raw.slice(0, match.index), body: raw.slice(match.index + match[0].length) };
}

/**
 * Reads one header, unfolding continuation lines first.
 *
 * Unfolding is what makes this safe: a DKIM-Signature's `h=` parameter lists the
 * header names it signed — including `Content-Transfer-Encoding:Message-ID:Subject:…`
 * — and those land on continuation lines. Searching the raw block would match inside
 * DKIM and shadow the real header, leaving quoted-printable bodies undecoded.
 */
function headerValue(head, name) {
  const unfolded = head.replace(/\r?\n[ \t]+/g, ' ');
  const match = unfolded.match(new RegExp(`^${name}:[ \\t]*(.*)$`, 'im'));
  return match ? match[1].trim() : '';
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function decodeBody(head, body) {
  const encoding = headerValue(head, 'Content-Transfer-Encoding').toLowerCase();
  if (encoding === 'quoted-printable') return decodeQuotedPrintable(body);
  if (encoding === 'base64') return Buffer.from(body.replace(/\s+/g, ''), 'base64').toString('utf8');
  return body;
}

/** Pulls the decoded HTML body and Subject out of a raw .eml (or passes plain HTML through). */
function extractMessage(raw) {
  if (!/^[\w-]+:/m.test(raw.slice(0, 200))) {
    return { subject: '', html: raw }; // plain .html file, no headers
  }

  const { head, body } = splitHeaders(raw);
  const subject = decodeMimeWords(headerValue(head, 'Subject'));
  const boundary = (headerValue(head, 'Content-Type').match(/boundary="?([^";]+)"?/i) || [])[1];

  // Single-part text/html is the common case here; multipart is handled by locating
  // the text/html part with the boundary the message actually declares.
  if (boundary) {
    const parts = body.split(new RegExp(`--${escapeRegex(boundary)}(?:--)?[ \\t]*\\r?\\n`));
    const htmlPart = parts.find((part) => /^Content-Type:\s*text\/html/im.test(splitHeaders(part).head));

    if (htmlPart) {
      const part = splitHeaders(htmlPart);
      return { subject, html: decodeBody(part.head, part.body) };
    }
  }

  return { subject, html: decodeBody(head, body) };
}

/** Minimal RFC 2047 decoding, enough for subjects carrying the student's name. */
function decodeMimeWords(str) {
  return str.replace(/=\?([^?]+)\?([BQ])\?([^?]*)\?=/gi, (_, charset, enc, text) => {
    if (enc.toUpperCase() === 'B') return Buffer.from(text, 'base64').toString('utf8');
    return decodeQuotedPrintable(text.replace(/_/g, ' '));
  });
}

const stripTags = (s) => s.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");

/** Reads `<strong>Label:</strong> value` out of the template, tolerating nested anchors. */
function field(html, label) {
  const re = new RegExp(`<strong>\\s*${label}\\s*:\\s*</strong>([\\s\\S]*?)</p>`, 'i');
  const m = html.match(re);
  if (!m) return '';
  const value = decodeEntities(stripTags(m[1]));
  return /^(not provided|—|-|n\/a)$/i.test(value) ? '' : value;
}

function preferredColleges(html) {
  const section = html.match(/Preferred Colleges[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (!section) return [];
  return [...section[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((m) => decodeEntities(stripTags(m[1])).replace(/^\d+\.\s*/, ''))
    .filter((s) => s && !/^none specified$/i.test(s));
}

function parseFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const { subject, html } = extractMessage(raw);

  // A subject is present for .eml; raw .html files are trusted as admin copies.
  if (subject && !ADMIN_SUBJECT.test(subject)) return null;

  const email = field(html, 'Email');
  if (!email || !email.includes('@')) return null;

  const rank = field(html, 'NEET Rank').replace(/^AIR\s*/i, '').replace(/[^\d]/g, '');

  return {
    source_file: path.basename(file),
    submitted_at: field(html, 'Date &amp; Time') || field(html, 'Date & Time') || field(html, 'Booking Date &amp; Time'),
    name: field(html, 'Full Name') || field(html, 'Name'),
    email,
    mobile: field(html, 'Mobile Number'),
    home_state: field(html, 'Home State'),
    neet_rank: rank,
    course: field(html, 'Course'),
    exam: field(html, 'Exam'),
    category: field(html, 'Category'),
    preferred_colleges: preferredColleges(html).join(' | '),
  };
}

const csvCell = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function main() {
  const dir = process.argv[2];
  if (!dir) {
    console.error('usage: node scripts/parse-lead-emails.mjs <directory-of-eml-files> > recovered-leads.csv');
    process.exit(1);
  }

  const files = walk(dir);
  const rows = [];
  const seen = new Map();
  let skipped = 0;
  let duplicates = 0;

  for (const file of files) {
    let row;
    try {
      row = parseFile(file);
    } catch (err) {
      console.error(`  ! failed to parse ${file}: ${err.message}`);
      continue;
    }

    if (!row) {
      skipped++;
      continue;
    }

    // Same student can submit twice; keep the richest record per address.
    const key = row.email.toLowerCase();
    const previous = seen.get(key);
    if (previous) {
      duplicates++;
      const score = (r) => Object.values(r).filter(Boolean).length;
      if (score(row) > score(previous)) seen.set(key, row);
      continue;
    }
    seen.set(key, row);
    rows.push(row);
  }

  const final = rows.map((r) => seen.get(r.email.toLowerCase()));
  const headers = Object.keys(final[0] || { source_file: '', email: '' });

  console.log(headers.join(','));
  for (const row of final) console.log(headers.map((h) => csvCell(row[h])).join(','));

  console.error(
    `\nparsed ${files.length} files -> ${final.length} unique leads ` +
    `(${skipped} skipped as non-admin/unparseable, ${duplicates} duplicate submissions collapsed)`
  );
}

main();
