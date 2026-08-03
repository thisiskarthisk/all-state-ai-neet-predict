// import { LOGGER } from '@/lib/logger';
// import { readFromFirebase, writeToFirebase } from './firebaseRealtimeDb';

// /**
//  * Server-side Zoho CRM OAuth 2.0 helper.
//  */

// const rawAccountsUrl = (
//   process.env.ZOHO_CRM_ACCOUNTS_URL ||
//   process.env.ZOHO_ACCOUNTS_URL ||
//   process.env.ZOHO_ACCOUNTS_DOMAIN ||
//   'https://accounts.zoho.com'
// ).trim().replace(/\/$/, '');

// const ZOHO_AUTH_API_URL = rawAccountsUrl.endsWith('/oauth/v2/token')
//   ? rawAccountsUrl
//   : `${rawAccountsUrl}/oauth/v2/token`;

// const rawApiUrl = (
//   process.env.ZOHO_CRM_API_BASE_URL ||
//   process.env.ZOHO_API_BASE_URL ||
//   process.env.ZOHO_API_URL ||
//   process.env.ZOHO_API_DOMAIN ||
//   'https://www.zohoapis.com/crm/v8'
// ).trim().replace(/\/$/, '');

// const ZOHO_CRM_API_BASE_URL = rawApiUrl.includes('/crm/')
//   ? rawApiUrl
//   : `${rawApiUrl}/crm/v8`;

// const CLIENT_ID = (process.env.ZOHO_CRM_CLIENT_ID || process.env.ZOHO_CLIENT_ID || '').trim();
// const CLIENT_SECRET = (process.env.ZOHO_CRM_CLIENT_SECRET || process.env.ZOHO_CLIENT_SECRET || '').trim();
// const REFRESH_TOKEN = (process.env.ZOHO_CRM_REFRESH_TOKEN || process.env.ZOHO_REFRESH_TOKEN || '').trim();
// const GRANT_TOKEN = (process.env.ZOHO_CRM_GRANT_TOKEN || process.env.ZOHO_GRANT_TOKEN || '').trim();
// const LEAD_SOURCE = (process.env.ZOHO_CRM_LEAD_SOURCE || process.env.ZOHO_LEAD_SOURCE || 'Karnataka AI NEET Predictor').trim();

// const FIREBASE_TOKEN_PATH = (process.env.FIREBASE_ZOHO_TOKEN_PATH || 'api_tokens/zoho-crm').trim().replace(/^\/|\/$/g, '');

// const EXPIRY_SKEW_SECONDS = 60;

// export interface ZohoTokenRecord {
//   access_token: string;
//   refresh_token?: string;
//   expires_at: number;
//   updated_at?: string;
// }

// export interface ZohoLeadInput {
//   name?: string | null;
//   email?: string | null;
//   mobile?: string | null;
//   homeState?: string | null;
//   zohoCrmLeadId?: string | null;
//   extraFields?: Record<string, unknown>;
// }

// const LEAD_API_NAMES = new Set([
//   'Last_Name',
//   'Name1',
//   'Email',
//   'Phone',
//   'Company',
//   'Neet_Rank',
//   'College_Name',
//   'Have_any_preferred_college',
//   'Platform',
//   'Form_Name',
//   'Campaign_Name',
//   'Registration_date',
//   'leadchain0__Social_Lead_ID',
// ]);

// const LEAD_FIELD_ALIASES: Record<string, string> = {
//   Name: 'Name1',
//   'Home State': 'Last_Name',
//   'NEET Rank': 'Neet_Rank',
//   'College Name': 'College_Name',
//   'Have any preferred college?': 'Have_any_preferred_college',
//   'Registration date': 'Registration_date',
//   'Social Lead ID': 'leadchain0__Social_Lead_ID',
//   'Campaign Name': 'Campaign_Name',
//   'Form Name': 'Form_Name',
// };

// function mapLeadFields(extraFields: Record<string, unknown>): Record<string, unknown> {
//   const mapped: Record<string, unknown> = {};

//   for (const [key, value] of Object.entries(extraFields)) {
//     const apiName = LEAD_API_NAMES.has(key) ? key : LEAD_FIELD_ALIASES[key];

//     if (!apiName) {
//       LOGGER.error(`[Zoho CRM] Unknown lead field ${JSON.stringify(key)} — dropping.`);
//       continue;
//     }

//     mapped[apiName] = value;
//   }

//   return mapped;
// }

// let cachedToken: ZohoTokenRecord | null = null;

// export function isZohoCRMEnabled(): boolean {
//   const flag = (process.env.ZOHO_CRM_ENABLED || 'true').trim().toLowerCase();
//   const enabled = flag !== 'false' && flag !== '0' && flag !== '';
//   return enabled && Boolean(CLIENT_ID && CLIENT_SECRET);
// }

// function isTokenValid(token: ZohoTokenRecord | null): boolean {
//   return Boolean(token?.access_token && token.expires_at > Date.now());
// }

// async function generateAccessToken(refreshTokenInput?: string | null): Promise<ZohoTokenRecord | null> {
//   const tokenToUse = refreshTokenInput || REFRESH_TOKEN;

//   if (!CLIENT_ID || !CLIENT_SECRET) {
//     LOGGER.warn('[Zoho CRM] Missing CLIENT_ID or CLIENT_SECRET in environment variables.');
//     return null;
//   }

//   const params = new URLSearchParams({
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET,
//   });

//   if (tokenToUse) {
//     params.set('grant_type', 'refresh_token');
//     params.set('refresh_token', tokenToUse);
//   } else if (GRANT_TOKEN) {
//     params.set('grant_type', 'authorization_code');
//     params.set('code', GRANT_TOKEN);
//   } else {
//     LOGGER.warn('[Zoho CRM] Missing refresh_token and grant_token in environment variables.');
//     return null;
//   }

//   try {
//     const response = await fetch(ZOHO_AUTH_API_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body: params.toString(),
//       cache: 'no-store',
//     });

//     const payload = await response.json().catch(() => null);

//     if (!response.ok || !payload?.access_token) {
//       LOGGER.error(
//         `[Zoho CRM] Access token request failed (${ZOHO_AUTH_API_URL}):`,
//         response.status,
//         payload?.error_description || payload?.error || payload
//       );
//       return null;
//     }

//     const record: ZohoTokenRecord = {
//       access_token: payload.access_token,
//       expires_at: Date.now() + (Number(payload.expires_in || 3600) - EXPIRY_SKEW_SECONDS) * 1000,
//       updated_at: new Date().toISOString(),
//     };

//     if (payload.refresh_token) {
//       record.refresh_token = payload.refresh_token;
//     } else if (tokenToUse) {
//       record.refresh_token = tokenToUse;
//     }

//     try {
//       await writeToFirebase(FIREBASE_TOKEN_PATH, record);
//     } catch (fbErr) {
//       LOGGER.warn('[Zoho CRM] Firebase token write skipped:', fbErr);
//     }

//     cachedToken = record;
//     return record;
//   } catch (err: any) {
//     LOGGER.error('[Zoho CRM] OAuth Token Generation Error:', err?.message || String(err));
//     return null;
//   }
// }

// async function getAccessToken(): Promise<string | null> {
//   if (cachedToken && isTokenValid(cachedToken)) {
//     return cachedToken.access_token;
//   }

//   let stored: ZohoTokenRecord | null = null;
//   try {
//     const record = (await readFromFirebase(FIREBASE_TOKEN_PATH)) as ZohoTokenRecord | null;
//     if (record?.access_token) {
//       stored = record;
//     }
//   } catch (fbErr) {
//     LOGGER.warn('[Zoho CRM] Firebase token read skipped:', fbErr);
//   }

//   if (stored && isTokenValid(stored)) {
//     cachedToken = stored;
//     return stored.access_token;
//   }

//   let tokenRecord = await generateAccessToken(stored?.refresh_token || REFRESH_TOKEN);

//   if (!tokenRecord?.access_token && stored?.refresh_token && REFRESH_TOKEN && stored.refresh_token !== REFRESH_TOKEN) {
//     LOGGER.warn('[Zoho CRM] Stored Firebase refresh_token failed/invalid. Retrying with env ZOHO_REFRESH_TOKEN...');
//     tokenRecord = await generateAccessToken(REFRESH_TOKEN);
//   }

//   if (!tokenRecord?.access_token) {
//     LOGGER.warn('[Zoho CRM] Unable to obtain access token.');
//     return null;
//   }

//   return tokenRecord.access_token;
// }

// async function requestZohoCRM(path: string, data: any, method: string = 'POST'): Promise<any | null> {
//   const token = await getAccessToken();
//   if (!token) return null;

//   const body = {
//     data: Array.isArray(data) ? data : [data],
//     trigger: ['workflow'],
//   };

//   try {
//     const response = await fetch(`${ZOHO_CRM_API_BASE_URL}/${path.replace(/^\//, '')}`, {
//       method: method.toUpperCase(),
//       headers: {
//         Authorization: `Zoho-oauthtoken ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//       cache: 'no-store',
//     });

//     const payload = await response.json().catch(() => null);

//     if (!response.ok) {
//       LOGGER.error('[Zoho CRM] Request failed:', method, path, response.status, payload);
//       return null;
//     }

//     return payload;
//   } catch (err: any) {
//     LOGGER.error('[Zoho CRM] API Request Error:', err?.message || String(err));
//     return null;
//   }
// }

// export async function addProductToLead(productIds: string | number | Array<string | number>, leadId: string): Promise<boolean> {
//   if (!isZohoCRMEnabled()) return false;

//   const products = (Array.isArray(productIds) ? productIds : [productIds]).map((id) => ({ id: String(id) }));

//   try {
//     const response = await requestZohoCRM(`Leads/${leadId}/Products`, products, 'PUT');
//     return String(response?.data?.[0]?.status || '').toLowerCase() === 'success';
//   } catch (error: any) {
//     LOGGER.error('[Zoho CRM] addProductToLead error:', error?.message || String(error));
//     return false;
//   }
// }

// export async function createLead(
//   student: ZohoLeadInput,
//   productId?: string | number | Array<string | number> | null
// ): Promise<string | null> {
//   if (!isZohoCRMEnabled()) {
//     LOGGER.log('[Zoho CRM] Disabled or unconfigured — skipping lead creation');
//     return null;
//   }

//   try {
//     let leadId = student.zohoCrmLeadId || null;

//     if (!leadId) {
//       const upsertData: Record<string, unknown> = {
//         Last_Name: student.homeState || 'Unknown',
//         Lead_Source: LEAD_SOURCE,
//       };

//       if (student.name) upsertData.Name1 = student.name;
//       if (student.email) upsertData.Email = student.email;
//       if (student.mobile) upsertData.Phone = student.mobile;

//       Object.assign(upsertData, mapLeadFields(student.extraFields || {}));

//       const response = await requestZohoCRM('Leads/upsert', upsertData);
//       const upsertedId = response?.data?.[0]?.details?.id;

//       if (upsertedId) {
//         leadId = String(upsertedId);
//       } else if (response?.data?.[0]?.status === 'error') {
//         const crmMsg = response.data[0].message || JSON.stringify(response.data[0]);
//         LOGGER.error('[Zoho CRM] Upsert Error:', crmMsg);
//       }
//     }

//     if (leadId && productId) {
//       await addProductToLead(productId, leadId);
//     }

//     return leadId;
//   } catch (error: any) {
//     LOGGER.error('[Zoho CRM] createLead error:', error?.message || String(error));
//     return null;
//   }
// }



//
// import { LOGGER } from '@/lib/logger';
// import { readFromFirebase, writeToFirebase } from './firebaseRealtimeDb';

// /**
//  * Server-side Zoho CRM OAuth 2.0 helper.
//  */

// const rawAccountsUrl = (
//   process.env.ZOHO_CRM_ACCOUNTS_URL ||
//   process.env.ZOHO_ACCOUNTS_URL ||
//   process.env.ZOHO_ACCOUNTS_DOMAIN ||
//   'https://accounts.zoho.com'
// ).trim().replace(/\/$/, '');

// const ZOHO_AUTH_API_URL = rawAccountsUrl.endsWith('/oauth/v2/token')
//   ? rawAccountsUrl
//   : `${rawAccountsUrl}/oauth/v2/token`;

// const rawApiUrl = (
//   process.env.ZOHO_CRM_API_BASE_URL ||
//   process.env.ZOHO_API_BASE_URL ||
//   process.env.ZOHO_API_URL ||
//   process.env.ZOHO_API_DOMAIN ||
//   'https://www.zohoapis.com/crm/v8'
// ).trim().replace(/\/$/, '');

// const ZOHO_CRM_API_BASE_URL = rawApiUrl.includes('/crm/')
//   ? rawApiUrl
//   : `${rawApiUrl}/crm/v8`;

// const CLIENT_ID = (process.env.ZOHO_CRM_CLIENT_ID || process.env.ZOHO_CLIENT_ID || '').trim();
// const CLIENT_SECRET = (process.env.ZOHO_CRM_CLIENT_SECRET || process.env.ZOHO_CLIENT_SECRET || '').trim();
// const REFRESH_TOKEN = (process.env.ZOHO_CRM_REFRESH_TOKEN || process.env.ZOHO_REFRESH_TOKEN || '').trim();
// const GRANT_TOKEN = (process.env.ZOHO_CRM_GRANT_TOKEN || process.env.ZOHO_GRANT_TOKEN || '').trim();
// const LEAD_SOURCE = (process.env.ZOHO_CRM_LEAD_SOURCE || process.env.ZOHO_LEAD_SOURCE || 'Karnataka AI NEET Predictor').trim();

// const FIREBASE_TOKEN_PATH = (process.env.FIREBASE_ZOHO_TOKEN_PATH || 'api_tokens/zoho-crm').trim().replace(/^\/|\/$/g, '');

// const EXPIRY_SKEW_SECONDS = 60;

// export interface ZohoTokenRecord {
//   access_token: string;
//   refresh_token?: string;
//   expires_at: number;
//   updated_at?: string;
// }

// export interface ZohoLeadInput {
//   name?: string | null;
//   email?: string | null;
//   mobile?: string | null;
//   homeState?: string | null;
//   zohoCrmLeadId?: string | null;
//   extraFields?: Record<string, unknown>;
// }

// const LEAD_API_NAMES = new Set([
//   'Last_Name',
//   'Name1',
//   'Email',
//   'Phone',
//   'Company',
//   'Neet_Rank',
//   'College_Name',
//   'Have_any_preferred_college',
//   'Platform',
//   'Form_Name',
//   'Campaign_Name',
//   'Registration_date',
//   'leadchain0__Social_Lead_ID',
// ]);

// const LEAD_FIELD_ALIASES: Record<string, string> = {
//   Name: 'Name1',
//   'Home State': 'Last_Name',
//   'NEET Rank': 'Neet_Rank',
//   'College Name': 'College_Name',
//   'Have any preferred college?': 'Have_any_preferred_college',
//   'Registration date': 'Registration_date',
//   'Social Lead ID': 'leadchain0__Social_Lead_ID',
//   'Campaign Name': 'Campaign_Name',
//   'Form Name': 'Form_Name',
// };

// function mapLeadFields(extraFields: Record<string, unknown>): Record<string, unknown> {
//   const mapped: Record<string, unknown> = {};

//   for (const [key, value] of Object.entries(extraFields)) {
//     const apiName = LEAD_API_NAMES.has(key) ? key : LEAD_FIELD_ALIASES[key];

//     if (!apiName) {
//       LOGGER.error(`[Zoho CRM] Unknown lead field ${JSON.stringify(key)} — dropping.`);
//       continue;
//     }

//     mapped[apiName] = value;
//   }

//   return mapped;
// }

// let cachedToken: ZohoTokenRecord | null = null;

// export function isZohoCRMEnabled(): boolean {
//   const flag = (process.env.ZOHO_CRM_ENABLED || 'true').trim().toLowerCase();
//   const enabled = flag !== 'false' && flag !== '0' && flag !== '';
//   return enabled && Boolean(CLIENT_ID && CLIENT_SECRET);
// }

// function isTokenValid(token: ZohoTokenRecord | null): boolean {
//   return Boolean(token?.access_token && token.expires_at > Date.now());
// }

// async function generateAccessToken(refreshTokenInput?: string | null): Promise<ZohoTokenRecord | null> {
//   const tokenToUse = refreshTokenInput || REFRESH_TOKEN;

//   if (!CLIENT_ID || !CLIENT_SECRET) {
//     LOGGER.warn('[Zoho CRM] Missing CLIENT_ID or CLIENT_SECRET in environment variables.');
//     return null;
//   }

//   const params = new URLSearchParams({
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET,
//   });

//   if (tokenToUse) {
//     params.set('grant_type', 'refresh_token');
//     params.set('refresh_token', tokenToUse);
//   } else if (GRANT_TOKEN) {
//     params.set('grant_type', 'authorization_code');
//     params.set('code', GRANT_TOKEN);
//   } else {
//     LOGGER.warn('[Zoho CRM] Missing refresh_token and grant_token in environment variables.');
//     return null;
//   }

//   try {
//     const response = await fetch(ZOHO_AUTH_API_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body: params.toString(),
//       cache: 'no-store',
//     });

//     const payload = await response.json().catch(() => null);

//     if (!response.ok || !payload?.access_token) {
//       LOGGER.error(
//         `[Zoho CRM] Access token request failed (${ZOHO_AUTH_API_URL}):`,
//         response.status,
//         payload?.error_description || payload?.error || payload
//       );
//       return null;
//     }

//     const record: ZohoTokenRecord = {
//       access_token: payload.access_token,
//       expires_at: Date.now() + (Number(payload.expires_in || 3600) - EXPIRY_SKEW_SECONDS) * 1000,
//       updated_at: new Date().toISOString(),
//     };

//     if (payload.refresh_token) {
//       record.refresh_token = payload.refresh_token;
//     } else if (tokenToUse) {
//       record.refresh_token = tokenToUse;
//     }

//     try {
//       await writeToFirebase(FIREBASE_TOKEN_PATH, record);
//     } catch (fbErr) {
//       LOGGER.warn('[Zoho CRM] Firebase token write skipped:', fbErr);
//     }

//     cachedToken = record;
//     return record;
//   } catch (err: any) {
//     LOGGER.error('[Zoho CRM] OAuth Token Generation Error:', err?.message || String(err));
//     return null;
//   }
// }

// async function getAccessToken(): Promise<string | null> {
//   if (cachedToken && isTokenValid(cachedToken)) {
//     return cachedToken.access_token;
//   }

//   let stored: ZohoTokenRecord | null = null;
//   try {
//     const record = (await readFromFirebase(FIREBASE_TOKEN_PATH)) as ZohoTokenRecord | null;
//     if (record?.access_token) {
//       stored = record;
//     }
//   } catch (fbErr) {
//     LOGGER.warn('[Zoho CRM] Firebase token read skipped:', fbErr);
//   }

//   if (stored && isTokenValid(stored)) {
//     cachedToken = stored;
//     return stored.access_token;
//   }

//   let tokenRecord = await generateAccessToken(stored?.refresh_token || REFRESH_TOKEN);

//   if (!tokenRecord?.access_token && stored?.refresh_token && REFRESH_TOKEN && stored.refresh_token !== REFRESH_TOKEN) {
//     LOGGER.warn('[Zoho CRM] Stored Firebase refresh_token failed/invalid. Retrying with env ZOHO_REFRESH_TOKEN...');
//     tokenRecord = await generateAccessToken(REFRESH_TOKEN);
//   }

//   if (!tokenRecord?.access_token) {
//     LOGGER.warn('[Zoho CRM] Unable to obtain access token.');
//     return null;
//   }

//   return tokenRecord.access_token;
// }

// async function requestZohoCRM(path: string, data: any, method: string = 'POST'): Promise<any | null> {
//   const token = await getAccessToken();
//   if (!token) return null;

//   const body = {
//     data: Array.isArray(data) ? data : [data],
//     trigger: ['workflow'],
//   };

//   try {
//     const response = await fetch(`${ZOHO_CRM_API_BASE_URL}/${path.replace(/^\//, '')}`, {
//       method: method.toUpperCase(),
//       headers: {
//         Authorization: `Zoho-oauthtoken ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//       cache: 'no-store',
//     });

//     const payload = await response.json().catch(() => null);

//     if (!response.ok) {
//       LOGGER.error('[Zoho CRM] Request failed:', method, path, response.status, payload);
//       return null;
//     }

//     return payload;
//   } catch (err: any) {
//     LOGGER.error('[Zoho CRM] API Request Error:', err?.message || String(err));
//     return null;
//   }
// }

// export async function addProductToLead(productIds: string | number | Array<string | number>, leadId: string): Promise<boolean> {
//   if (!isZohoCRMEnabled()) return false;

//   const products = (Array.isArray(productIds) ? productIds : [productIds]).map((id) => ({ id: String(id) }));

//   try {
//     const response = await requestZohoCRM(`Leads/${leadId}/Products`, products, 'PUT');
//     return String(response?.data?.[0]?.status || '').toLowerCase() === 'success';
//   } catch (error: any) {
//     LOGGER.error('[Zoho CRM] addProductToLead error:', error?.message || String(error));
//     return false;
//   }
// }

// export async function createLead(
//   student: ZohoLeadInput,
//   productId?: string | number | Array<string | number> | null
// ): Promise<string | null> {
//   if (!isZohoCRMEnabled()) {
//     LOGGER.log('[Zoho CRM] Disabled or unconfigured — skipping lead creation');
//     return null;
//   }

//   try {
//     let leadId = student.zohoCrmLeadId || null;

//     if (!leadId) {
//       const upsertData: Record<string, unknown> = {
//         Last_Name: student.homeState || 'Unknown',
//         Lead_Source: LEAD_SOURCE,
//       };

//       if (student.name) upsertData.Name1 = student.name;
//       if (student.email) upsertData.Email = student.email;
//       if (student.mobile) upsertData.Phone = student.mobile;

//       Object.assign(upsertData, mapLeadFields(student.extraFields || {}));

//       const response = await requestZohoCRM('Leads/upsert', upsertData);
//       const upsertedId = response?.data?.[0]?.details?.id;

//       if (upsertedId) {
//         leadId = String(upsertedId);
//       } else if (response?.data?.[0]?.status === 'error') {
//         const crmMsg = response.data[0].message || JSON.stringify(response.data[0]);
//         LOGGER.error('[Zoho CRM] Upsert Error:', crmMsg);
//       }
//     }

//     if (leadId && productId) {
//       await addProductToLead(productId, leadId);
//     }

//     return leadId;
//   } catch (error: any) {
//     LOGGER.error('[Zoho CRM] createLead error:', error?.message || String(error));
//     return null;
//   }
// }




// import { LOGGER } from '@/lib/logger';
// import { readFromFirebase, writeToFirebase } from './firebaseRealtimeDb';

// /**
//  * Zoho CRM helper — port of the Laravel `App\Helpers\CRM\ZohoCRMHelper`.
//  *
//  * Difference from the Laravel version: there is no `api_tokens` table here, so
//  * the OAuth token record (access token + refresh token + expiry) is persisted in
//  * Firebase Realtime Database via its REST API. No SDK is needed for that, which
//  * keeps this usable from serverless route handlers with zero extra dependencies.
//  *
//  * Server-side only — it reads secrets from `process.env`, so never import it
//  * from a `'use client'` component.
//  */

// const ZOHO_AUTH_API_URL = (process.env.ZOHO_CRM_ACCOUNTS_URL || 'https://accounts.zoho.com/oauth/v2/token').trim();
// const ZOHO_CRM_API_BASE_URL = (process.env.ZOHO_CRM_API_BASE_URL || 'https://www.zohoapis.com/crm/v8').trim().replace(/\/$/, '');

// const CLIENT_ID = (process.env.ZOHO_CRM_CLIENT_ID || '').trim();
// const CLIENT_SECRET = (process.env.ZOHO_CRM_CLIENT_SECRET || '').trim();
// const GRANT_TOKEN = (process.env.ZOHO_CRM_GRANT_TOKEN || '').trim();
// const LEAD_SOURCE = (process.env.ZOHO_CRM_LEAD_SOURCE || 'NEET Predictor').trim();

// const FIREBASE_TOKEN_PATH = (process.env.FIREBASE_ZOHO_TOKEN_PATH || 'api_tokens/zoho-crm').trim().replace(/^\/|\/$/g, '');

// /** Refresh this many seconds before Zoho's stated expiry, same skew as the PHP helper. */
// const EXPIRY_SKEW_SECONDS = 60;

// export interface ZohoTokenRecord {
//   access_token: string;
//   refresh_token?: string;
//   /** Epoch milliseconds — stored as a number so Firebase can hold it as plain JSON. */
//   expires_at: number;
//   updated_at?: string;
// }

// export interface ZohoLeadInput {
//   name?: string | null;
//   email?: string | null;
//   mobile?: string | null;
//   /**
//    * The student's home state. Written to `Last_Name`, which this layout repurposes
//    * as its "Home State" column — see the note on `createLead`.
//    */
//   homeState?: string | null;
//   /** Pass the previously stored lead id to skip the upsert and only attach products. */
//   zohoCrmLeadId?: string | null;
//   /**
//    * Any additional Zoho field, keyed by either its exact API name (`College_Name`)
//    * or the label shown in the Zoho UI (`'College Name'`). Anything else is logged
//    * and dropped — see `LEAD_FIELD_ALIASES`.
//    */
//   extraFields?: Record<string, unknown>;
// }

// /**
//  * Every writable field on this org's Leads layout, by exact API name.
//  *
//  * This allow-list exists because Zoho **silently discards** payload keys it does not
//  * recognise and still answers `{"status": "success"}` — a misspelled field is
//  * indistinguishable from a successful write in the response. Verified against
//  * `GET /crm/v8/Leads/{id}` on 2026-07-30.
//  */
// const LEAD_API_NAMES = new Set([
//   'Last_Name',
//   'Name1',
//   'Email',
//   'Phone',
//   'Company',
//   'Neet_Rank',
//   'College_Name',
//   'Have_any_preferred_college',
//   'Platform',
//   'Form_Name',
//   'Campaign_Name',
//   'Registration_date',
//   'leadchain0__Social_Lead_ID',
// ]);

// /**
//  * UI label -> API name, for the fields whose API name you would never guess.
//  * Note `Neet_Rank` (not `NEET_Rank`), that the student's name lives in the custom
//  * `Name1` field, and that `Last_Name` carries the home state.
//  */
// const LEAD_FIELD_ALIASES: Record<string, string> = {
//   Name: 'Name1',
//   'Home State': 'Last_Name',
//   'NEET Rank': 'Neet_Rank',
//   'College Name': 'College_Name',
//   'Have any preferred college?': 'Have_any_preferred_college',
//   'Registration date': 'Registration_date',
//   'Social Lead ID': 'leadchain0__Social_Lead_ID',
//   'Campaign Name': 'Campaign_Name',
//   'Form Name': 'Form_Name',
// };

// /** Resolves caller-supplied keys to real API names, complaining about the ones Zoho would drop. */
// function mapLeadFields(extraFields: Record<string, unknown>): Record<string, unknown> {
//   const mapped: Record<string, unknown> = {};

//   for (const [key, value] of Object.entries(extraFields)) {
//     const apiName = LEAD_API_NAMES.has(key) ? key : LEAD_FIELD_ALIASES[key];

//     if (!apiName) {
//       LOGGER.error(
//         `[Zoho CRM] Unknown lead field ${JSON.stringify(key)} — not on the Leads layout, so Zoho would ` +
//         `accept the request and silently ignore it. Dropping. Known API names: ${Array.from(LEAD_API_NAMES).join(', ')}`
//       );
//       continue;
//     }

//     mapped[apiName] = value;
//   }

//   return mapped;
// }

// /** Warm-lambda cache so we don't hit Firebase on every single CRM call. */
// let cachedToken: ZohoTokenRecord | null = null;

// export function isZohoCRMEnabled(): boolean {
//   const flag = (process.env.ZOHO_CRM_ENABLED || 'true').trim().toLowerCase();
//   const enabled = flag !== 'false' && flag !== '0' && flag !== '';
//   return enabled && Boolean(CLIENT_ID && CLIENT_SECRET);
// }

// function isTokenValid(token: ZohoTokenRecord | null): boolean {
//   return Boolean(token?.access_token && token.expires_at > Date.now());
// }

// /**
//  * Exchanges the refresh token (or, on first run, the one-time grant token) for a
//  * fresh access token and persists the result.
//  *
//  * Note: Zoho returns `refresh_token` only for the `authorization_code` grant, so
//  * the refresh path deliberately keeps the existing one.
//  */
// async function generateAccessToken(refreshToken?: string | null): Promise<ZohoTokenRecord | null> {
//   const params = new URLSearchParams({
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET,
//   });

//   if (refreshToken) {
//     params.set('grant_type', 'refresh_token');
//     params.set('refresh_token', refreshToken);
//   } else {
//     if (!GRANT_TOKEN) {
//       throw new Error('No stored refresh token and ZOHO_CRM_GRANT_TOKEN is empty — generate a new grant token from the Zoho API console');
//     }
//     // A grant token is single-use and expires in minutes; this branch should only
//     // ever run once, on the very first call.
//     params.set('grant_type', 'authorization_code');
//     params.set('code', GRANT_TOKEN);
//   }

//   const response = await fetch(ZOHO_AUTH_API_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: params.toString(),
//     cache: 'no-store',
//   });

//   const payload = await response.json().catch(() => null);

//   if (!response.ok || !payload?.access_token) {
//     // Zoho answers with HTTP 200 + `{"error": "invalid_code"}` on failure, so the
//     // body matters more than the status here.
//     LOGGER.error('[Zoho CRM] Access token request failed:', response.status, payload);
//     return null;
//   }

//   const record: ZohoTokenRecord = {
//     access_token: payload.access_token,
//     expires_at: Date.now() + (Number(payload.expires_in || 3600) - EXPIRY_SKEW_SECONDS) * 1000,
//     updated_at: new Date().toISOString(),
//   };

//   if (payload.refresh_token) {
//     record.refresh_token = payload.refresh_token;
//   } else if (refreshToken) {
//     record.refresh_token = refreshToken;
//   }

//   await writeToFirebase(FIREBASE_TOKEN_PATH, record);
//   cachedToken = record;

//   return record;
// }

// /** Returns a valid access token, refreshing/creating it through Firebase-stored state as needed. */
// async function getAccessToken(): Promise<string> {
//   if (cachedToken && isTokenValid(cachedToken)) {
//     return cachedToken.access_token;
//   }

//   // Firebase returns the literal `null` for a path that does not exist yet.
//   const record = (await readFromFirebase(FIREBASE_TOKEN_PATH)) as ZohoTokenRecord | null;
//   const stored = record?.access_token ? record : null;

//   if (stored && isTokenValid(stored)) {
//     cachedToken = stored;
//     return stored.access_token;
//   }

//   const token = stored?.refresh_token
//     ? await generateAccessToken(stored.refresh_token)
//     : await generateAccessToken();

//   if (!token) {
//     throw new Error('Unable to generate access token');
//   }

//   return token.access_token;
// }

// /** Low-level Zoho CRM request. Wraps the payload the way every CRM v8 write endpoint expects. */
// async function requestZohoCRM(path: string, data: any, method: string = 'POST'): Promise<any | null> {
//   const token = await getAccessToken();

//   const body = {
//     data: Array.isArray(data) ? data : [data],
//     trigger: ['workflow'],
//   };

//   const response = await fetch(`${ZOHO_CRM_API_BASE_URL}/${path.replace(/^\//, '')}`, {
//     method: method.toUpperCase(),
//     headers: {
//       Authorization: `Zoho-oauthtoken ${token}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(body),
//     cache: 'no-store',
//   });

//   const payload = await response.json().catch(() => null);

//   if (!response.ok) {
//     LOGGER.error('[Zoho CRM] Request failed:', method, path, response.status, payload);
//     return null;
//   }

//   return payload;
// }

// /** Attaches one or more Zoho product records to an existing lead. */
// export async function addProductToLead(productIds: string | number | Array<string | number>, leadId: string): Promise<boolean> {
//   if (!isZohoCRMEnabled()) return false;

//   const products = (Array.isArray(productIds) ? productIds : [productIds]).map((id) => ({ id: String(id) }));

//   try {
//     const response = await requestZohoCRM(`Leads/${leadId}/Products`, products, 'PUT');

//     return String(response?.data?.[0]?.status || '').toLowerCase() === 'success';
//   } catch (error) {
//     LOGGER.error('[Zoho CRM] addProductToLead error:', error);
//     return false;
//   }
// }

// /**
//  * Upserts a lead and optionally attaches products to it. Returns the Zoho lead id,
//  * or `null` when the CRM is disabled or the call fails.
//  *
//  * Persisting the returned id (the Laravel version writes it back to the student row)
//  * is left to the caller — pass it back as `zohoCrmLeadId` to skip the upsert next time.
//  */
// export async function createLead(
//   student: ZohoLeadInput,
//   productId?: string | number | Array<string | number> | null
// ): Promise<string | null> {
//   if (!isZohoCRMEnabled()) {
//     LOGGER.log('[Zoho CRM] Disabled or not configured — skipping lead creation');
//     return null;
//   }

//   try {
//     let leadId = student.zohoCrmLeadId || null;

//     if (!leadId) {
//       const upsertData: Record<string, unknown> = {
//         // This layout repurposes Zoho's mandatory `Last_Name` as its "Home State"
//         // column — the leads from the live KA-Meta form hold "Telangana", "Tamil Nadu"
//         // etc. here. Zoho rejects a blank Last_Name, hence the fallback.
//         Last_Name: student.homeState || 'Unknown',
//         // Not on the current layout, so Zoho drops it — kept for when it is restored.
//         Lead_Source: LEAD_SOURCE,
//       };

//       // The student's name belongs in the custom `Name1` field, not `Last_Name`.
//       if (student.name) upsertData.Name1 = student.name;
//       if (student.email) upsertData.Email = student.email;
//       if (student.mobile) upsertData.Phone = student.mobile;

//       // Applied last so an explicit extraFields entry can override the defaults above.
//       Object.assign(upsertData, mapLeadFields(student.extraFields || {}));

//       const response = await requestZohoCRM('Leads/upsert', upsertData);
//       const upsertedId = response?.data?.[0]?.details?.id;

//       if (upsertedId) {
//         leadId = String(upsertedId);
//       }
//     }

//     if (leadId && productId) {
//       await addProductToLead(productId, leadId);
//     }

//     return leadId;
//   } catch (error) {
//     LOGGER.error('[Zoho CRM] createLead error:', error);
//     return null;
//   }
// }

//



import { LOGGER } from '@/lib/logger';
import { readFromFirebase, writeToFirebase } from './firebaseRealtimeDb';

/**
 * Zoho CRM helper — port of the Laravel `App\Helpers\CRM\ZohoCRMHelper`.
 *
 * Difference from the Laravel version: there is no `api_tokens` table here, so
 * the OAuth token record (access token + refresh token + expiry) is persisted in
 * Firebase Realtime Database via its REST API. No SDK is needed for that, which
 * keeps this usable from serverless route handlers with zero extra dependencies.
 *
 * Server-side only — it reads secrets from `process.env`, so never import it
 * from a `'use client'` component.
 */

const ZOHO_AUTH_API_URL = (process.env.ZOHO_CRM_ACCOUNTS_URL || 'https://accounts.zoho.com/oauth/v2/token').trim();
const ZOHO_CRM_API_BASE_URL = (process.env.ZOHO_CRM_API_BASE_URL || 'https://www.zohoapis.com/crm/v8').trim().replace(/\/$/, '');

const CLIENT_ID = (process.env.ZOHO_CRM_CLIENT_ID || '').trim();
const CLIENT_SECRET = (process.env.ZOHO_CRM_CLIENT_SECRET || '').trim();
const GRANT_TOKEN = (process.env.ZOHO_CRM_GRANT_TOKEN || '').trim();
const LEAD_SOURCE = (process.env.ZOHO_CRM_LEAD_SOURCE || 'NEET Predictor').trim();

const FIREBASE_TOKEN_PATH = (process.env.FIREBASE_ZOHO_TOKEN_PATH || 'api_tokens/zoho-crm').trim().replace(/^\/|\/$/g, '');

/** Refresh this many seconds before Zoho's stated expiry, same skew as the PHP helper. */
const EXPIRY_SKEW_SECONDS = 60;

export interface ZohoTokenRecord {
  access_token: string;
  refresh_token?: string;
  /** Epoch milliseconds — stored as a number so Firebase can hold it as plain JSON. */
  expires_at: number;
  updated_at?: string;
}

export interface ZohoLeadInput {
  name?: string | null;
  email?: string | null;
  mobile?: string | null;
  /**
   * The student's home state. Written to `Last_Name`, which this layout repurposes
   * as its "Home State" column — see the note on `createLead`.
   */
  homeState?: string | null;
  /** Pass the previously stored lead id to skip the upsert and only attach products. */
  zohoCrmLeadId?: string | null;
  /**
   * Any additional Zoho field, keyed by either its exact API name (`College_Name`)
   * or the label shown in the Zoho UI (`'College Name'`). Anything else is logged
   * and dropped — see `LEAD_FIELD_ALIASES`.
   */
  extraFields?: Record<string, unknown>;
}

/**
 * Every writable field on this org's Leads layout, by exact API name.
 *
 * This allow-list exists because Zoho **silently discards** payload keys it does not
 * recognise and still answers `{"status": "success"}` — a misspelled field is
 * indistinguishable from a successful write in the response. Verified against
 * `GET /crm/v8/Leads/{id}` on 2026-07-30.
 */
const LEAD_API_NAMES = new Set([
  'Last_Name',
  'Name1',
  'Email',
  'Phone',
  'Company',
  'Neet_Rank',
  'College_Name',
  'Have_any_preferred_college',
  'Platform',
  'Form_Name',
  'Campaign_Name',
  'Registration_date',
  'leadchain0__Social_Lead_ID',
  'Neet_Couses',
  'Target_Course',
  'Exam_Type',
  'Category',
  'Target_State',
  'Description',
]);

/**
 * UI label -> API name, for the fields whose API name you would never guess.
 * Note `Neet_Rank` (not `NEET_Rank`), that the student's name lives in the custom
 * `Name1` field, and that `Last_Name` carries the home state.
 */
const LEAD_FIELD_ALIASES: Record<string, string> = {
  Name: 'Name1',
  'Home State': 'Last_Name',
  'NEET Rank': 'Neet_Rank',
  'College Name': 'College_Name',
  'Have any preferred college?': 'Have_any_preferred_college',
  'Registration date': 'Registration_date',
  'Social Lead ID': 'leadchain0__Social_Lead_ID',
  'Campaign Name': 'Campaign_Name',
  'Form Name': 'Form_Name',
  'Target Course': 'Target_Course',
  'Exam Type': 'Exam_Type',
  'Target State': 'Target_State',
};

/** Resolves caller-supplied keys to real API names, complaining about the ones Zoho would drop. */
function mapLeadFields(extraFields: Record<string, unknown>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(extraFields)) {
    const apiName = LEAD_API_NAMES.has(key) ? key : LEAD_FIELD_ALIASES[key];

    if (!apiName) {
      LOGGER.error(
        `[Zoho CRM] Unknown lead field ${JSON.stringify(key)} — not on the Leads layout, so Zoho would ` +
        `accept the request and silently ignore it. Dropping. Known API names: ${Array.from(LEAD_API_NAMES).join(', ')}`
      );
      continue;
    }

    mapped[apiName] = value;
  }

  return mapped;
}

/** Warm-lambda cache so we don't hit Firebase on every single CRM call. */
let cachedToken: ZohoTokenRecord | null = null;

export function isZohoCRMEnabled(): boolean {
  const flag = (process.env.ZOHO_CRM_ENABLED || 'true').trim().toLowerCase();
  const enabled = flag !== 'false' && flag !== '0' && flag !== '';
  return enabled && Boolean(CLIENT_ID && CLIENT_SECRET);
}

function isTokenValid(token: ZohoTokenRecord | null): boolean {
  return Boolean(token?.access_token && token.expires_at > Date.now());
}

/**
 * Exchanges the refresh token (or, on first run, the one-time grant token) for a
 * fresh access token and persists the result.
 *
 * Note: Zoho returns `refresh_token` only for the `authorization_code` grant, so
 * the refresh path deliberately keeps the existing one.
 */
async function generateAccessToken(refreshToken?: string | null): Promise<ZohoTokenRecord | null> {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  if (refreshToken) {
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', refreshToken);
  } else {
    if (!GRANT_TOKEN) {
      throw new Error('No stored refresh token and ZOHO_CRM_GRANT_TOKEN is empty — generate a new grant token from the Zoho API console');
    }
    // A grant token is single-use and expires in minutes; this branch should only
    // ever run once, on the very first call.
    params.set('grant_type', 'authorization_code');
    params.set('code', GRANT_TOKEN);
  }

  const response = await fetch(ZOHO_AUTH_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.access_token) {
    // Zoho answers with HTTP 200 + `{"error": "invalid_code"}` on failure, so the
    // body matters more than the status here.
    LOGGER.error('[Zoho CRM] Access token request failed:', response.status, payload);
    return null;
  }

  const record: ZohoTokenRecord = {
    access_token: payload.access_token,
    expires_at: Date.now() + (Number(payload.expires_in || 3600) - EXPIRY_SKEW_SECONDS) * 1000,
    updated_at: new Date().toISOString(),
  };

  if (payload.refresh_token) {
    record.refresh_token = payload.refresh_token;
  } else if (refreshToken) {
    record.refresh_token = refreshToken;
  }

  await writeToFirebase(FIREBASE_TOKEN_PATH, record);
  cachedToken = record;

  return record;
}

/** Returns a valid access token, refreshing/creating it through Firebase-stored state as needed. */
async function getAccessToken(): Promise<string> {
  if (cachedToken && isTokenValid(cachedToken)) {
    return cachedToken.access_token;
  }

  // Firebase returns the literal `null` for a path that does not exist yet.
  const record = (await readFromFirebase(FIREBASE_TOKEN_PATH)) as ZohoTokenRecord | null;
  const stored = record?.access_token ? record : null;

  if (stored && isTokenValid(stored)) {
    cachedToken = stored;
    return stored.access_token;
  }

  const token = stored?.refresh_token
    ? await generateAccessToken(stored.refresh_token)
    : await generateAccessToken();

  if (!token) {
    throw new Error('Unable to generate access token');
  }

  return token.access_token;
}

/** Low-level Zoho CRM request. Wraps the payload the way every CRM v8 write endpoint expects. */
async function requestZohoCRM(path: string, data: any, method: string = 'POST'): Promise<any | null> {
  const token = await getAccessToken();

  const body = {
    data: Array.isArray(data) ? data : [data],
    trigger: ['workflow'],
  };

  const response = await fetch(`${ZOHO_CRM_API_BASE_URL}/${path.replace(/^\//, '')}`, {
    method: method.toUpperCase(),
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    LOGGER.error('[Zoho CRM] Request failed:', method, path, response.status, payload);
    return null;
  }

  return payload;
}

/** Attaches one or more Zoho product records to an existing lead. */
export async function addProductToLead(productIds: string | number | Array<string | number>, leadId: string): Promise<boolean> {
  if (!isZohoCRMEnabled()) return false;

  const products = (Array.isArray(productIds) ? productIds : [productIds]).map((id) => ({ id: String(id) }));

  try {
    const response = await requestZohoCRM(`Leads/${leadId}/Products`, products, 'PUT');

    return String(response?.data?.[0]?.status || '').toLowerCase() === 'success';
  } catch (error) {
    LOGGER.error('[Zoho CRM] addProductToLead error:', error);
    return false;
  }
}

/**
 * Upserts a lead and optionally attaches products to it. Returns the Zoho lead id,
 * or `null` when the CRM is disabled or the call fails.
 *
 * Persisting the returned id (the Laravel version writes it back to the student row)
 * is left to the caller — pass it back as `zohoCrmLeadId` to skip the upsert next time.
 */
export async function createLead(
  student: ZohoLeadInput,
  productId?: string | number | Array<string | number> | null
): Promise<string | null> {
  if (!isZohoCRMEnabled()) {
    LOGGER.log('[Zoho CRM] Disabled or not configured — skipping lead creation');
    return null;
  }

  try {
    let leadId = student.zohoCrmLeadId || null;

    if (!leadId) {
      const upsertData: Record<string, unknown> = {
        // This layout repurposes Zoho's mandatory `Last_Name` as its "Home State"
        // column — the leads from the live KA-Meta form hold "Telangana", "Tamil Nadu"
        // etc. here. Zoho rejects a blank Last_Name, hence the fallback.
        Last_Name: student.homeState || 'Unknown',
        // Not on the current layout, so Zoho drops it — kept for when it is restored.
        Lead_Source: LEAD_SOURCE,
      };

      // The student's name belongs in the custom `Name1` field, not `Last_Name`.
      if (student.name) upsertData.Name1 = student.name;
      if (student.email) upsertData.Email = student.email;
      if (student.mobile) upsertData.Phone = student.mobile;

      // Applied last so an explicit extraFields entry can override the defaults above.
      Object.assign(upsertData, mapLeadFields(student.extraFields || {}));

      const response = await requestZohoCRM('Leads/upsert', upsertData);
      const upsertedId = response?.data?.[0]?.details?.id;

      if (upsertedId) {
        leadId = String(upsertedId);
      }
    }

    if (leadId && productId) {
      await addProductToLead(productId, leadId);
    }

    return leadId;
  } catch (error) {
    LOGGER.error('[Zoho CRM] createLead error:', error);
    return null;
  }
}