// import { createLead } from '@/lib/zoho-crm';
// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       name,
//       mobileNo,
//       email,
//       homeState,
//       studentProfile,
//       selectedColleges,
//       leadSource = 'NEET Predictor App',
//     } = body;

//     // 2. Format Selected Colleges & registration Date/Time for Zoho CRM fields and Description
//     const now = new Date();
//     const isoDateTime = now.toISOString(); // Valid ISO 8601 datetime for Zoho CRM datetime field type
//     const todayDate = isoDateTime.split('T')[0]; // Valid YYYY-MM-DD date for Zoho CRM date field type
//     const cleanDateTimeStr = `${todayDate} ${now.toTimeString().split(' ')[0]}`;

//     // Extract pure integer number for Neet_Rank (Zoho CRM expects integer data type)
//     const rawRank = studentProfile?.rank;
//     let intRank: number | null = null;
//     if (rawRank) {
//       const digitsOnly = String(rawRank).replace(/\D/g, '');
//       if (digitsOnly) {
//         const parsed = parseInt(digitsOnly, 10);
//         if (!isNaN(parsed)) intRank = parsed;
//       }
//     }

//     const collegeNamesList = (selectedColleges || [])
//       .map((c: any) => (typeof c === 'string' ? c : (c.college_name || c.name)))
//       .filter(Boolean);
//     const collegeNamesStr = collegeNamesList.length > 0 ? collegeNamesList.join(', ') : 'None';

//     const cleanState = (st: string) => {
//       if (!st) return 'Karnataka';
//       if (st.includes('Karnataka') || st.startsWith('KA')) return 'Karnataka';
//       return st.replace(/\s*\([^)]*\)/g, '').trim() || st;
//     };

//     const homeStateVal = cleanState(homeState || 'Karnataka');

//     const extraFields: Record<string, any> = {
//       College_Name: collegeNamesStr,
//       Platform: 'Web',
//       Form_Name: 'College Predictor',
//     };
//     if (intRank !== null && !isNaN(intRank)) {
//       extraFields.Neet_Rank = intRank;
//     }

//     const crmLeadId = await createLead({
//       name: name,
//       email: email,
//       mobile: mobileNo,
//       homeState: homeStateVal,
//       extraFields,
//     });

//     if (!crmLeadId) {
//       console.warn('[Zoho CRM] Lead Push returned null (CRM disabled, credentials unconfigured, or offline)');
//       return NextResponse.json({
//         success: true,
//         message: 'Lead received successfully',
//         result: { leadId: null },
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Lead successfully created in Zoho CRM',
//       result: { leadId: crmLeadId },
//     });
//   } catch (err: any) {
//     console.error('[Zoho CRM] Handler Error:', err);
//     return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
//   }
// }

import { createLead } from '@/lib/zoho-crm';
import { NextResponse } from 'next/server';

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

    const cleanState = (st: string) => {
      if (!st) return 'Karnataka';
      if (st.includes('Karnataka') || st.startsWith('KA')) return 'Karnataka';
      return st.replace(/\s*\([^)]*\)/g, '').trim() || st;
    };

    const homeStateVal = cleanState(homeState || 'Karnataka');

    const crmLeadId = await createLead({
      name: name,
      email: email,
      mobile: mobileNo,
      homeState: homeStateVal,
      extraFields: {
        College_Name: collegeNamesStr,
        Neet_Rank: intRank || '',
        Platform: 'Web',
        Form_Name: 'College Predictor',
      },
    });

    if (!crmLeadId) {
      console.error('[Zoho CRM] Lead Push Error:', crmLeadId);
      return NextResponse.json({ error: 'Zoho CRM lead creation failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Lead successfully created in Zoho CRM',
      result: { leadId: crmLeadId },
    });
  } catch (err: any) {
    console.error('[Zoho CRM] Handler Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}