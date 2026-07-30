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

    // 2. Format Selected Colleges & registration Date/Time for Zoho CRM fields and Description
    const now = new Date();
    const isoDateTime = now.toISOString(); // Valid ISO 8601 datetime for Zoho CRM datetime field type
    const todayDate = isoDateTime.split('T')[0]; // Valid YYYY-MM-DD date for Zoho CRM date field type
    const cleanDateTimeStr = `${todayDate} ${now.toTimeString().split(' ')[0]}`;

    // Extract pure integer number for Neet_Rank (Zoho CRM expects integer data type)
    const rawRank = studentProfile?.rank;
    let intRank: number | null = null;
    if (rawRank) {
      const digitsOnly = String(rawRank).replace(/\D/g, '');
      if (digitsOnly) {
        const parsed = parseInt(digitsOnly, 10);
        if (!isNaN(parsed)) intRank = parsed;
      }
    }

    const collegeNamesList = (selectedColleges || [])
      .map((c: any) => (typeof c === 'string' ? c : (c.college_name || c.name)))
      .filter(Boolean);
    const collegeNamesStr = collegeNamesList.length > 0 ? collegeNamesList.join(', ') : 'None';

    const collegeListStr = (selectedColleges || [])
      .map((c: any, idx: number) => {
        const cName = typeof c === 'string' ? c : (c.college_name || c.name || `College ${idx + 1}`);
        return `${idx + 1}. ${cName}`;
      })
      .join('\n');

    const courseVal = studentProfile?.course || 'MBBS';

    const cleanState = (st: string) => {
      if (!st) return 'Karnataka';
      if (st.includes('Karnataka') || st.startsWith('KA')) return 'Karnataka';
      return st.replace(/\s*\([^)]*\)/g, '').trim() || st;
    };

    const homeStateVal = cleanState(homeState || 'Karnataka');
    const targetStateVal = cleanState(studentProfile?.states || homeStateVal);

    const descriptionNotes = [
      `Name: ${name || 'Karthi'}`,
      `Email: ${email || 'N/A'}`,
      `Phone: ${mobileNo || 'N/A'}`,
      `NEET Rank: ${studentProfile?.rank || 'N/A'}`,
      `NEET Course: ${courseVal}`,
      `Target State: ${targetStateVal}`,
      `Home State: ${homeStateVal}`,
      `\nSelected Colleges (${(selectedColleges || []).length}):\n${collegeListStr || 'None selected'}`,
    ].join('\n');

    // 3. Prepare Lead payload for Zoho CRM Leads module (Counselling Student Information)
    const leadDataObj: Record<string, any> = {
      Last_Name: name || 'Karthi',
      First_Name: name || 'Karthi',
      Student_Name: name || 'Karthi',
      Student_name: name || 'Karthi',
      Email: email || '',
      Phone: mobileNo || '',
      Mobile: mobileNo || '',
      Lead_Source: leadSource,

      // Neet Courses / Couses (all possible Zoho CRM API key variations)
      Neet_Couses: courseVal,
      NEET_Couses: courseVal,
      Neet_Couse: courseVal,
      NEET_Couse: courseVal,
      Neet_Course: courseVal,
      Neet_Courses: courseVal,
      NEET_Course: courseVal,
      NEET_Courses: courseVal,
      Course: courseVal,
      Courses: courseVal,
      Target_Course: courseVal,

      // Target State variations
      Target_State: targetStateVal,
      Target_State1: targetStateVal,
      Target_state: targetStateVal,
      TARGET_STATE: targetStateVal,
      Preferred_State: targetStateVal,
      Preferred_States: targetStateVal,

      // Home State variations
      Home_State: homeStateVal,
      Home_State1: homeStateVal,
      Home_state: homeStateVal,
      HOME_STATE: homeStateVal,
      State: homeStateVal,

      // College Name variations
      College_Name: collegeNamesStr,
      College_name: collegeNamesStr,
      Selected_Colleges: collegeNamesStr,

      Description: descriptionNotes,
    };

    // Only attach Neet_Rank if we have a valid integer number (Zoho CRM expects integer)
    if (intRank !== null) {
      leadDataObj.Neet_Rank = intRank;
      leadDataObj.NEET_Rank = intRank;
    }

    const leadPayload = {
      data: [leadDataObj],
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
