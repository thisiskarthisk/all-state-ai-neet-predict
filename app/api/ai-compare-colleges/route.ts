// import { NextResponse } from 'next/server';
// import { collegeComparisonPrompt } from '@/lib/ai/prompts';

// function cleanJsonResponse(text: string): any {
//   if (!text) throw new Error('Response text is empty');
//   let cleaned = text.trim();
//   cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
//   const firstBrace = cleaned.indexOf('{');
//   const lastBrace = cleaned.lastIndexOf('}');
//   if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
//     cleaned = cleaned.substring(firstBrace, lastBrace + 1);
//   }
//   cleaned = cleaned.replace(/,\s*([\}\]])/g, '$1');
//   return JSON.parse(cleaned);
// }

// // Helper to normalize raw college types (Govt = Government, Society, Trust; Pvt = Private; Deemed)
// const normalizeCollegeType = (typeRaw: any): 'Govt' | 'Private' | 'Deemed' => {
//   if (!typeRaw) return 'Govt';
//   const t = String(typeRaw).toLowerCase();
//   if (t.includes('deem')) return 'Deemed';
//   if (t.includes('pvt') || t.includes('private') || t.includes('priv') || t.includes('vate')) return 'Private';
//   if (t.includes('govt') || t.includes('govern') || t.includes('society') || t.includes('trust')) return 'Govt';
//   return 'Govt';
// };

// async function callPerplexityForCollegeCompare(promptText: string) {
//   const apiKey = process.env.PERPLEXITY_API_KEY || '';
//   if (!apiKey) {
//     throw new Error('PERPLEXITY_API_KEY is not configured.');
//   }

//   const response = await fetch('https://api.perplexity.ai/chat/completions', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${apiKey}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       model: 'sonar',
//       max_tokens: 4000,
//       temperature: 0.2,
//       messages: [
//         {
//           role: 'system',
//           content: 'You are a professional medical admissions counselor. You only respond with valid structured JSON output.'
//         },
//         {
//           role: 'user',
//           content: promptText
//         }
//       ]
//     }),
//   });

//   if (!response.ok) {
//     const errText = await response.text();
//     throw new Error(`Perplexity API error: ${response.status} - ${errText}`);
//   }

//   const data = await response.json();
//   const rawText = data?.choices?.[0]?.message?.content || '';
//   return cleanJsonResponse(rawText);
// }

// async function callGeminiFallback(promptText: string) {
//   const apiKey = process.env.GEMINI_API_KEY || '';
//   if (!apiKey) {
//     throw new Error('GEMINI_API_KEY is not configured.');
//   }

//   const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: promptText }] }],
//         generationConfig: {
//           temperature: 0.2,
//           responseMimeType: 'application/json',
//         },
//       }),
//     }
//   );

//   if (!response.ok) {
//     const errText = await response.text();
//     throw new Error(`Gemini API error: ${response.status} - ${errText}`);
//   }

//   const data = await response.json();
//   const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
//   return cleanJsonResponse(rawText);
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { colleges, category = 'Gen', examType = 'UG' } = body;

//     if (!colleges || !Array.isArray(colleges) || colleges.length === 0) {
//       return NextResponse.json(
//         { error: 'Please provide at least one college to compare.' },
//         { status: 400 }
//       );
//     }

//     const isPg = examType === 'PG';
//     const categoryLabel = category === 'Gen' ? 'General' : category;
//     const promptText = collegeComparisonPrompt(colleges, category, examType);

//     // Try Perplexity API first as requested
//     try {
//       const perplexityResult = await callPerplexityForCollegeCompare(promptText);
//       if (perplexityResult && Array.isArray(perplexityResult.colleges) && perplexityResult.colleges.length > 0) {
//         return NextResponse.json({ success: true, colleges: perplexityResult.colleges, provider: 'perplexity' });
//       }
//     } catch (perplexityErr) {
//       console.warn('Perplexity API call failed, trying Gemini fallback:', perplexityErr);
//       try {
//         const geminiResult = await callGeminiFallback(promptText);
//         if (geminiResult && Array.isArray(geminiResult.colleges) && geminiResult.colleges.length > 0) {
//           return NextResponse.json({ success: true, colleges: geminiResult.colleges, provider: 'gemini' });
//         }
//       } catch (geminiErr) {
//         console.warn('Gemini fallback failed as well, using JSON dataset fallback:', geminiErr);
//       }
//     }

//     // Direct JSON dataset fallback if both AI APIs are unconfigured or fail
//     const fallbackColleges = colleges.map((c: any) => {
//       const nameOnly = c['College Name'] || c.name || 'Medical College';
//       const courseName = c['Course Name'] || (isPg ? 'MD / MS' : 'MBBS');
//       const name = isPg && courseName ? `${nameOnly} - ${courseName}` : nameOnly;
//       const city = c['City'] || c.city || 'India';
//       const state = c['State'] || c.state || '';
//       const typeNormalized = normalizeCollegeType(c['Type'] || c.type);
//       const seats = c['2026 Total Seats'] || c.seats || (isPg ? 3 : 150);

//       const isGovt = typeNormalized === 'Govt';
//       const isDeemed = typeNormalized === 'Deemed';

//       const fees = isGovt ? (isPg ? 30000 : 15000) : isDeemed ? (isPg ? 2800000 : 2200000) : (isPg ? 1500000 : 1100000);
//       const feesLabel = isGovt ? (isPg ? '₹30,000 / yr' : '₹15,000 / yr') : isDeemed ? (isPg ? '₹28L / yr' : '₹22L / yr') : (isPg ? '₹15L / yr' : '₹11L / yr');

//       // Look up category specific cutoffs from dataset
//       let cutoff = 15000;
//       const r1CatKey = `Round 1 ${category}`;
//       const r2CatKey = `Round 2 ${category}`;
//       const r3CatKey = `Round 3 ${category}`;
//       const strayCatKey = `Stray ${category}`;

//       if (c[r1CatKey]) cutoff = Math.round(Number(c[r1CatKey]));
//       else if (c[r2CatKey]) cutoff = Math.round(Number(c[r2CatKey]));
//       else if (c[r3CatKey]) cutoff = Math.round(Number(c[r3CatKey]));
//       else if (c[strayCatKey]) cutoff = Math.round(Number(c[strayCatKey]));
//       else if (c['Round 1 Gen']) {
//         const baseCutoff = Number(c['Round 1 Gen']);
//         if (category === 'SC') cutoff = Math.round(baseCutoff * 3.2);
//         else if (category === 'ST') cutoff = Math.round(baseCutoff * 5.5);
//         else if (category === 'OBC-NCL') cutoff = Math.round(baseCutoff * 1.05);
//         else if (category === 'EWS') cutoff = Math.round(baseCutoff * 1.08);
//         else cutoff = Math.round(baseCutoff);
//       } else if (isGovt) {
//         if (category === 'SC') cutoff = 38000;
//         else if (category === 'ST') cutoff = 65000;
//         else cutoff = 15000;
//       } else if (isDeemed) {
//         cutoff = 85000;
//       } else {
//         cutoff = 32000;
//       }

//       return {
//         name,
//         loc: state ? `${city}, ${state}` : city,
//         address: c.Address || `${city}, ${state || 'India'}`,
//         fees,
//         feesLabel,
//         seats: Number(seats) || 150,
//         seatsLabel: `${seats || (isPg ? 3 : 150)} seats`,
//         cutoff,
//         cutoffLabel: `AIR ${cutoff.toLocaleString('en-IN')} (${categoryLabel})`,
//         hostel: 'Available',
//         hostelLabel: 'Available (Campus Mess & Rooms)',
//         accreditation: isGovt ? 'NMC / Govt Approved' : 'NMC Recognized',
//       };
//     });

//     return NextResponse.json({ success: true, colleges: fallbackColleges, provider: 'dataset' });
//   } catch (err: any) {
//     console.error('Error in ai-compare-colleges POST route:', err);
//     return NextResponse.json(
//       { error: err.message || 'Internal server error while processing college comparison.' },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from 'next/server';
import { collegeComparisonPrompt } from '@/lib/ai/prompts';

function cleanJsonResponse(text: string): any {
  if (!text) throw new Error('Response text is empty');
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  cleaned = cleaned.replace(/,\s*([\}\]])/g, '$1');
  return JSON.parse(cleaned);
}

async function callPerplexityForCollegeCompare(promptText: string) {
  const apiKey = process.env.PERPLEXITY_API_KEY || '';
  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY is not configured.');
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      max_tokens: 4000,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: 'You are a professional medical admissions counselor. You only respond with valid structured JSON output.'
        },
        {
          role: 'user',
          content: promptText
        }
      ]
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content || '';
  return cleanJsonResponse(rawText);
}

async function callGeminiFallback(promptText: string) {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return cleanJsonResponse(rawText);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { colleges, category = 'Gen' } = body;

    if (!colleges || !Array.isArray(colleges) || colleges.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one college to compare.' },
        { status: 400 }
      );
    }

    const categoryLabel = category === 'Gen' ? 'General' : category;
    const promptText = collegeComparisonPrompt(colleges, category);

    // Try Perplexity API first as requested
    try {
      const perplexityResult = await callPerplexityForCollegeCompare(promptText);
      if (perplexityResult && Array.isArray(perplexityResult.colleges) && perplexityResult.colleges.length > 0) {
        return NextResponse.json({ success: true, colleges: perplexityResult.colleges, provider: 'perplexity' });
      }
    } catch (perplexityErr) {
      console.warn('Perplexity API call failed, trying Gemini fallback:', perplexityErr);
      try {
        const geminiResult = await callGeminiFallback(promptText);
        if (geminiResult && Array.isArray(geminiResult.colleges) && geminiResult.colleges.length > 0) {
          return NextResponse.json({ success: true, colleges: geminiResult.colleges, provider: 'gemini' });
        }
      } catch (geminiErr) {
        console.warn('Gemini fallback failed as well, using JSON dataset fallback:', geminiErr);
      }
    }

    // Direct JSON dataset fallback if both AI APIs are unconfigured or fail
    const fallbackColleges = colleges.map((c: any) => {
      const name = c['College Name'] || c.name || 'Medical College';
      const city = c['City'] || c.city || 'India';
      const state = c['State'] || c.state || '';
      const type = c['Type'] || c.type || 'Government';
      const seats = c['2026 Total Seats'] || c.seats || 150;

      const isGovt = type.toLowerCase().includes('govt') || type.toLowerCase().includes('government');
      const isDeemed = type.toLowerCase().includes('deemed');

      const fees = isGovt ? 15000 : isDeemed ? 2200000 : 1100000;
      const feesLabel = isGovt ? '₹15,000 / yr' : isDeemed ? '₹22L / yr' : '₹11L / yr';

      // Look up category specific cutoffs from UgMasterCollegeList.json
      let cutoff = 15000;
      const r1CatKey = `Round 1 ${category}`;
      const r2CatKey = `Round 2 ${category}`;
      const strayCatKey = `Stray ${category}`;

      if (c[r1CatKey]) cutoff = Math.round(Number(c[r1CatKey]));
      else if (c[r2CatKey]) cutoff = Math.round(Number(c[r2CatKey]));
      else if (c[strayCatKey]) cutoff = Math.round(Number(c[strayCatKey]));
      else if (c['Round 1 Gen']) {
        const baseCutoff = Number(c['Round 1 Gen']);
        if (category === 'SC') cutoff = Math.round(baseCutoff * 3.2);
        else if (category === 'ST') cutoff = Math.round(baseCutoff * 5.5);
        else if (category === 'OBC-NCL') cutoff = Math.round(baseCutoff * 1.05);
        else if (category === 'EWS') cutoff = Math.round(baseCutoff * 1.08);
        else cutoff = Math.round(baseCutoff);
      } else if (isGovt) {
        if (category === 'SC') cutoff = 45000;
        else if (category === 'ST') cutoff = 78000;
        else cutoff = 8500;
      } else if (isDeemed) {
        cutoff = 85000;
      } else {
        cutoff = 32000;
      }

      // Quota Cutoffs calculation for AIQ, State, and Management Quotas
      let aiqLabel = '';
      let stateLabel = '';
      let mgmtLabel = '';

      if (isGovt) {
        aiqLabel = `AIR ${cutoff.toLocaleString('en-IN')} (15% AIQ - ${categoryLabel})`;
        stateLabel = `AIR ${Math.round(cutoff * 1.8).toLocaleString('en-IN')} (85% State Domicile)`;
        mgmtLabel = 'N/A (100% Government Seats)';
      } else if (isDeemed) {
        aiqLabel = `AIR ${cutoff.toLocaleString('en-IN')} (100% MCC Deemed General)`;
        stateLabel = 'N/A (100% All India MCC Counselling)';
        mgmtLabel = `AIR ${Math.round(cutoff * 2.2).toLocaleString('en-IN')} (Management / NRI Quota)`;
      } else {
        aiqLabel = `AIR ${Math.round(cutoff * 1.5).toLocaleString('en-IN')} (Open Merit Seats)`;
        stateLabel = `AIR ${cutoff.toLocaleString('en-IN')} (State Merit Quota)`;
        mgmtLabel = `AIR ${Math.round(cutoff * 3.5).toLocaleString('en-IN')} (Management / NRI Quota)`;
      }

      return {
        name,
        loc: state ? `${city}, ${state}` : city,
        address: c.Address || `${city}, ${state || 'India'}`,
        fees,
        feesLabel,
        seats: Number(seats) || 150,
        seatsLabel: `${seats || 150} seats`,
        cutoff,
        cutoffLabel: `AIR ${cutoff.toLocaleString('en-IN')} (${categoryLabel})`,
        aiq_cutoff: cutoff,
        aiq_cutoffLabel: aiqLabel,
        state_cutoff: isGovt ? Math.round(cutoff * 1.8) : cutoff,
        state_cutoffLabel: stateLabel,
        management_cutoff: isGovt ? 999999 : Math.round(cutoff * 3.5),
        management_cutoffLabel: mgmtLabel,
        hostel: 'Available',
        hostelLabel: 'Available (Campus Mess & Rooms)',
        accreditation: isGovt ? 'A+ Grade (Government Board)' : 'A Grade',
      };
    });

    return NextResponse.json({ success: true, colleges: fallbackColleges, provider: 'local_json' });
  } catch (err: any) {
    console.error('Error in ai-compare-colleges:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to compare colleges.' },
      { status: 500 }
    );
  }
}