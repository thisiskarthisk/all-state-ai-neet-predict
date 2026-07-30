/**
 * Utility functions for Zoho CRM API Integration (OAuth 2.0)
 */

export interface ZohoLeadOwner {
  id: string;
  name: string;
  email?: string;
}

export interface ZohoLead {
  id: string;
  Full_Name?: string;
  First_Name?: string;
  Last_Name?: string;
  Student_Name?: string;
  Company?: string;
  Phone?: string;
  Mobile?: string;
  Email?: string;
  Neet_Rank?: number | string;
  NEET_Rank?: number | string;
  College_Name?: string;
  College_name?: string;
  Selected_Colleges?: string;
  Target_State?: string;
  Target_State1?: string;
  Target_state?: string;
  Preferred_State?: string;
  Home_State?: string;
  Neet_Couses?: string;
  Lead_Status?: string;
  Owner?: ZohoLeadOwner;
  Created_Time?: string;
  [key: string]: any;
}

export interface ZohoLeadsResponse {
  data: ZohoLead[];
  info: {
    per_page: number;
    count: number;
    page: number;
    more_records: boolean;
  };
}

// In-memory token cache to prevent Zoho OAuth rate-limiting ("You have made too many requests continuously")
let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Retrieves a Zoho CRM Access Token using OAuth 2.0 Refresh Token.
 * Caches token in memory for 55 minutes to prevent rate limiting.
 */
export async function getZohoAccessToken(): Promise<string> {
  // If we have a valid cached token (with 5-minute safety margin), return it immediately
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 5 * 60 * 1000) {
    return cachedAccessToken;
  }

  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const accountsDomain =
    process.env.ZOHO_ACCOUNTS_DOMAIN ||
    process.env.ZOHO_ACCOUNTS_URL ||
    'https://accounts.zoho.in';

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Missing Zoho CRM credentials. Please configure ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN in your environment variables.'
    );
  }

  const tokenUrl = `${accountsDomain}/oauth/v2/token?refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token`;

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    cache: 'no-store',
  });

  const data = await res.json();

  if (!res.ok || !data.access_token) {
    console.error('[Zoho CRM OAuth Error]', data);
    throw new Error(
      data.error_description || data.error || 'Failed to refresh Zoho CRM access token. Please try again in a few moments.'
    );
  }

  // Cache access token for expires_in seconds (default 3600s = 1 hour)
  const expiresInMs = (data.expires_in || 3600) * 1000;
  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + expiresInMs;

  return cachedAccessToken!;
}

/**
 * Fetches list of Leads from Zoho CRM API (v3) with pagination support (default 10 per page)
 */
export async function fetchZohoLeads(page = 1, perPage = 10): Promise<ZohoLeadsResponse> {
  const accessToken = await getZohoAccessToken();
  const apiDomain =
    process.env.ZOHO_API_DOMAIN ||
    process.env.ZOHO_API_URL ||
    'https://www.zohoapis.in';

  const fields = [
    'id',
    'Full_Name',
    'First_Name',
    'Last_Name',
    'Student_Name',
    'Phone',
    'Mobile',
    'Email',
    'Neet_Rank',
    'NEET_Rank',
    'College_Name',
    'College_name',
    'Selected_Colleges',
    'Target_State',
    'Target_State1',
    'Target_state',
    'Preferred_State',
    'Home_State',
    'Neet_Couses',
    'Created_Time',
  ].join(',');

  const url = `${apiDomain}/crm/v3/Leads?page=${page}&per_page=${perPage}&fields=${fields}&sort_by=Created_Time&sort_order=desc`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (res.status === 204) {
    return {
      data: [],
      info: {
        per_page: perPage,
        count: 0,
        page,
        more_records: false,
      },
    };
  }

  const data = await res.json();

  if (!res.ok) {
    // If token expired unexpectedly, invalidate cache so next call gets a new token
    if (res.status === 401 || data.code === 'INVALID_TOKEN') {
      cachedAccessToken = null;
      tokenExpiresAt = 0;
    }
    console.error('[Zoho CRM Fetch Leads Error]', data);
    throw new Error(
      data.message || data.error || `Zoho CRM API responded with status ${res.status}`
    );
  }

  return {
    data: data.data || [],
    info: data.info || {
      per_page: perPage,
      count: (data.data || []).length,
      page,
      more_records: false,
    },
  };
}
