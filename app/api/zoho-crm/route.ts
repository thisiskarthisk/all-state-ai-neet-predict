import { NextResponse } from 'next/server';

/**
 * Utility to get a fresh Zoho CRM Access Token using Refresh Token
 */
async function getZohoAccessToken(): Promise<string> {
  const accountsUrl = process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.in';
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Zoho CRM credentials missing in environment variables.');
  }

  const tokenUrl = `${accountsUrl}/oauth/v2/token?refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token`;

  const res = await fetch(tokenUrl, { method: 'POST' });
  const data = await res.json();

  if (!res.ok || !data.access_token) {
    console.error('[Zoho CRM] Token Error Response:', data);
    throw new Error(data.error || 'Failed to refresh Zoho CRM access token.');
  }

  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      mobileNo,
      email,
      homeState,
      studentProfile,
      selectedColleges,
      leadSource = 'NEET Predictor App',
    } = body;

    // 1. Get Access Token
    const accessToken = await getZohoAccessToken();
    const apiUrl = process.env.ZOHO_API_URL || 'https://www.zohoapis.in';

    // 2. Format Selected Colleges list into clean text for CRM Description
    const collegeListStr = (selectedColleges || [])
      .map((c: any, idx: number) => {
        const cName = c.college_name || c.name || `College ${idx + 1}`;
        const cState = c.state_name || c.state || '';
        const cutoff = c.closest_cutoff ? ` (Closing Rank: ~${c.closest_cutoff})` : '';
        return `${idx + 1}. ${cName} ${cState ? `[${cState}]` : ''}${cutoff}`;
      })
      .join('\n');

    const descriptionNotes = [
      `NEET Rank: ${studentProfile?.rank || 'N/A'}`,
      `NEET Exam: ${studentProfile?.exam || 'NEET UG'}`,
      `Target Course: ${studentProfile?.course || 'MBBS'}`,
      `Category: ${studentProfile?.category || 'General'}`,
      `Home State: ${homeState || 'Karnataka'}`,
      `Preferred States: ${studentProfile?.states || 'N/A'}`,
      `\nSelected Colleges (${(selectedColleges || []).length}):\n${collegeListStr || 'None selected'}`,
    ].join('\n');

    // 3. Prepare Lead payload for Zoho CRM Leads module
    const leadPayload = {
      data: [
        {
          Last_Name: name || 'NEET Candidate',
          Email: email || '',
          Phone: mobileNo || '',
          Mobile: mobileNo || '',
          Lead_Source: leadSource,
          Description: descriptionNotes,
        },
      ],
      trigger: ['approval', 'workflow', 'blueprint'],
    };

    // 4. POST Lead to Zoho CRM API v3
    const crmResponse = await fetch(`${apiUrl}/crm/v3/Leads`, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadPayload),
    });

    const crmResult = await crmResponse.json();

    if (!crmResponse.ok) {
      console.error('[Zoho CRM] Lead Push Error:', crmResult);
      return NextResponse.json({ error: 'Zoho CRM lead creation failed', details: crmResult }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Lead successfully created in Zoho CRM',
      result: crmResult,
    });
  } catch (err: any) {
    console.error('[Zoho CRM] Handler Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
