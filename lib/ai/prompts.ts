import { getAuthorityForState } from './counsellingAuthorities';
import { KARNATAKA_UG_COLLEGES } from '../data/KarnatakaState/ugCollegeList';
import { ALLSTATE_UG_COLLEGES } from '../data/allstate/ugCollegeList';
import { getPgMasterCollegeList } from '../data/allstate/PgMasterCollegeList';

export function rankPrompt(marksNum: number, maxMarks: number, examName: string, currentYear: number) {
  return `
    You are an expert medical admissions analyst.
    The student entered a score of ${marksNum} out of ${maxMarks} in ${examName}.

    Note:
      - If the official actual NEET ${currentYear} score vs. rank data/results for this score are available in your knowledge base, you MUST return the accurate actual rank and percentile for the year ${currentYear}.
      - If the official actual ${currentYear} results are not available in your knowledge base (or you are unsure), use historical score vs. rank trends from previous 3 years and calculate/predict the rank using estimation formulas for ${currentYear} using the following calculation: (
        Analyze and calculate:
          1. Expected general rank for this score (expected).
          2. High and low boundaries for the rank range (rangeLow and rangeHigh).
          3. Approximate calculated percentile (percentile) e.g. 98.89.
          4. Low and high bounds of the percentile range (percentileLow and percentileHigh) e.g. 96.9 and 99.9.
          5. Confidence level for this prediction (confidenceLevel) - must be "High", "Medium", or "Low".
          6. A brief Year-over-Year Trend Analysis (trendAnalysis) explaining recent paper trends and cutoff movements.
          7. A short "What this means for you" text (whatThisMeans) suggesting eligibility or counseling options.
          8. Historical closing/cutoff ranks corresponding to this score for last 3 years in reverse order.
          9. An array of year-by-year breakdowns under "years". Each item must contain "year" (integer), "rank" (actual rank if available, otherwise estimated rank for that year), and "trend" (a short description of the difficulty trend or paper pattern of that year, e.g., "Moderate paper, normal cutoff", "Tough paper, lower cutoff", "Inflated ranks, easy paper").
          10. A brief projectionNote providing guidance/counselling insight on this rank.
        )
    
    Respond with ONLY a valid, plain JSON object structured in this exact format (do not wrap in markdown):
    {
      "expected": number,
      "rangeLow": number,
      "rangeHigh": number,
      "percentile": number,
      "percentileLow": number,
      "percentileHigh": number,
      "confidenceLevel": "string",
      "trendAnalysis": "string",
      "whatThisMeans": "string",
      "averageRank": number,
      "years": [
        { "year": last year number, "rank": number, "trend": "string" }
        { "year": previous year, "rank": number, "trend": "string" }
        { "year": previous year, "rank": number, "trend": "string" }
      ],
      "projectionNote": "string"
    }
  `;
}

export function collegePrompt(
  rankNum: number,
  examName: string,
  examMetadata: { code: string; fullName: string },
  targetCategory: string,
  targetCoursesStr: string,
  preferredStateStr: string
) {
  const isPg = examMetadata.code === 'NEET_PG';
  const isKarnatakaOnly = preferredStateStr.toLowerCase().includes('karnataka') || preferredStateStr === 'KA';
  
  const ugDataset = isKarnatakaOnly ? KARNATAKA_UG_COLLEGES : ALLSTATE_UG_COLLEGES;

  const datasetSummary = isPg
    ? getPgMasterCollegeList()
        .slice(0, 100)
        .map((c: any) => `• ${c['College Name']} (${c.State || 'India'}, ${c.Type || 'Govt'}): ${c['Course Name']} — Round 1 Gen Closing AIR ${c['Round 1 Gen'] || 'N/A'}`)
        .join('\n')
    : ugDataset.map((c: any) => `• ${c.collegeName || c.college_name} (${c.city || c.city_name}, ${c.collegeType || c.college_type}): ${c.course || c.courses?.[0]?.course_name || 'MBBS'} — Closing AIR ${c.closingRank || c.courses?.[0]?.categories?.[0]?.closing_rank || 150000}`).join('\n');

  return `
    You are a professional medical admissions consultant specializing in NEET counselling in India.
    A student is asking for medical college counselling with the following profile:
    - Exam: ${examName} (${examMetadata.fullName})
    - NEET All India Rank: ${rankNum}
    - Category: ${targetCategory}
    - Target Course(s): ${targetCoursesStr}
    - Preferred State(s)/Quotas: ${preferredStateStr}

    Based on your knowledge of REAL historical NEET cutoff ranks (specifically Round 1 and Round 2
    closing ranks published by KEA - Karnataka Examinations Authority and MCC), predict and recommend a
    comprehensive list of at least 15 to 25 eligible medical & dental colleges in Karnataka
    (or preferred states) where the student's rank qualifies under category "${targetCategory}".

    ============================================================
    VERIFIED KARNATAKA COLLEGE DATASET & BASELINE CUTOFFS:
    ============================================================
    The following is our ground truth dataset of Government, Private, and Deemed medical colleges in Karnataka:
${datasetSummary}

    ============================================================
    CATEGORY EVALUATION & COLLEGE MATCHING INSTRUCTIONS (${targetCategory}):
    ============================================================
    1. GROUND TRUTH NAMES: Use the exact official college names from the verified dataset above.
    2. CATEGORY CUTOFF PROJECTION (${targetCategory}):
       - For General (UR): baseline closing ranks apply.
       - For OBC / SC / ST / EWS: Project realistic category-specific cutoff ranks for each college in the dataset.
         (Category cutoffs generally extend to higher rank numbers than General).
    3. GOVERNMENT + PRIVATE MIX:
       - Check the student's rank (${rankNum}) against ALL Government, Private, and Deemed colleges in the dataset for category "${targetCategory}".
       - Return ALL qualifying Government and Private colleges where the candidate has a High, Medium, or Reach chance of admission.
       - For high ranks, focus on Private Medical Colleges, Deemed Universities, and Management Quota seats where cutoffs extend higher.
    ============================================================
    CRITICAL — COLLEGE NAME FIELD MUST BE CLEAN (mandatory):
    ============================================================
    - "name" must contain ONLY the college's real official name — exactly what appears
      on its own signboard/letterhead. Nothing else.
    - NEVER append parenthetical notes, hedges, confidence labels, or placeholders to the
      name. Do NOT output things like:
        "College Name (Private/Deemed-like estimate placeholder)"
        "College Name (approx)"
        "College Name (unverified)"
        "College Name (estimated)"
    - If you are unsure whether a college is real, or unsure of its type/cutoff, do NOT
      express that uncertainty inside the "name" field. Either:
        (a) give your best real, confident answer directly in the proper fields
            ("collegeType", "cutoffRank"), or
        (b) leave that college out of the list entirely.
    - Do not invent vague, generic, or fragment names like "Research Centre" or
      "Medical Institute" — only return real, specifically-named institutions.
    ============================================================

    ============================================================
    CRITICAL — GOVERNMENT + PRIVATE MIX (mandatory):
    ============================================================
    - Your list MUST include a realistic MIX of BOTH:
        • Government / Government-Aided colleges (state govt medical colleges, central
          govt institutes like AIIMS/JIPMER/central universities)
        • Private / Deemed / Trust-run colleges (self-financing private medical colleges,
          deemed universities)
    - Do NOT return a list that is all-government or all-private. Aim for roughly a mix
      reflecting real seat availability for this rank/category (e.g. if the rank only
      realistically qualifies for private seats in most government colleges, say so
      honestly rather than inventing a government seat that wouldn't exist).
    - For EVERY college, set "collegeType" to exactly one of: "Government", "Private",
      "Deemed", or "Government-Aided". This must reflect the college's actual real-world
      ownership/status — do not default everything to "Government".
    - When relevant, note within the data that private/deemed colleges typically carry
      significantly higher fees than government colleges — this is real-world context the
      student needs, even though fee amounts are not part of the JSON schema below.

    ============================================================
    CRITICAL — CUTOFF ACCURACY RULES (violating these ruins the tool):
    ============================================================
    1. A college's "cutoffRank" is a HISTORICAL FACT about that specific college, course,
       and category from real past counselling rounds. It has NOTHING to do with the
       student's own rank (${rankNum}). NEVER copy, echo, or reuse ${rankNum} (or any
       number close to it) as a cutoffRank value.
    2. Cutoffs MUST differ meaningfully across colleges based on real-world reputation and
       demand. Government colleges generally (but not always) have tighter cutoffs than
       private/deemed colleges for the same course/category — reflect that realistically,
       don't force it artificially.
    3. Within one college, cutoffs must also differ sensibly across categories:
       General (UR) < EWS < OBC-NCL < SC < ST (rank number generally increases in that order).
    4. Only include a college/course/category combination if you have a genuine, specific
       historical cutoff estimate for it. If unsure of the exact number, use your best
       realistic estimate grounded in comparable colleges of similar tier/state/type — but
       it must be a distinct, plausible number, never equal to the student's rank.
    5. "chanceOfAdmission" must be computed honestly by comparing cutoffRank to the
       student's rank (${rankNum}):
         - "High" only if the student's rank is comfortably (≥30%) better than the cutoff.
         - "Medium" if moderately better (10–30% margin).
         - "Reach" if close to or slightly worse than the cutoff.
    ============================================================

    IMPORTANT: You MUST return a substantial list of at least 15-20 colleges if the selected
    states/quotas contain them, with a real mix of government and private/deemed institutions
    as described above. Sort by suitability (best-fitting / most realistic chances first).

    Important instructions based on the selected exam:
    - For NEET UG: Recommend MBBS, BDS, BAMS, BHMS, etc.
    - For NEET PG: Recommend MD, MS, PG Diploma specializations.
    - For NEET MDS: Recommend MDS dental specializations.

    For each college, provide:
    1. "name": The official full name of the college ONLY — see the name-field rules above.
    2. "state": The state where the college is located.
    3. "city": The city/district where the college is located.
    4. "collegeType": One of "Government", "Private", "Deemed", or "Government-Aided" —
       must reflect the college's real ownership status (see rules above).
    5. For each course offered by this college, provide:
      - "course": The course name (e.g. MBBS, BDS, BAMS, MD General Medicine, MS General Surgery, MDS Orthodontics).
      - For all applicable categories (General, OBC, SC, ST, EWS), provide:
        - "category": The category name (General, OBC, SC, ST, EWS).
        - "cutoffRank": The REAL, distinct, historically-grounded closing cutoff rank for
          this specific course and category at this specific college.
        - "chanceOfAdmission": The admission probability, honestly computed as described above
          ("High", "Medium", or "Reach").

    Before finalizing your answer, review your own "colleges" array:
      (a) if any "name" value contains parentheses with hedging/estimate/placeholder
          wording, strip it down to just the real college name, or remove that college.
      (b) if most cutoffRank values are identical or suspiciously close to ${rankNum},
          discard those and replace with realistic differentiated historical estimates.
      (c) if "collegeType" is the same for every college, fix it — a real result set for
          this rank/category/state combination will include both government and
          private/deemed options.

    You must respond with ONLY a valid JSON object in this exact format:
    {
      "colleges": [
        {
          "name": "string",
          "state": "string",
          "city": "string",
          "collegeType": "Government" | "Private" | "Deemed" | "Government-Aided",
          "courses": [
            {
              "course": "string",
              "categories": [
                {
                  "category": "string",
                  "cutoffRank": number,
                  "chanceOfAdmission": "string"
                }
              ]
            }
          ]
        }
      ]
    }
  `;
}


export function counsellingPrompt(
  selectedColleges: {
    name: string;
    state: string;
    city?: string;
    college_id?: string | number;
    collegeType?: string;
  }[],
  examName: string,
  targetCategory: string,
  targetCourse: string
) {
  const collegesListStr = selectedColleges
    .map(
      (c, i) =>
        `${i + 1}. ID: ${c.college_id} | Name: ${c.name} | City: ${c.city || 'TBA'} | State: ${c.state} | Type: ${c.collegeType || 'Unknown — determine from your own knowledge'}`
    )
    .join('\n');

  // Build a VERIFIED reference block only for the states actually present in
  // this request — this is real, human-confirmed data, not AI memory. The
  // model is told to treat it as ground truth for officialWebsite/authority,
  // which is what makes each state's result genuinely different instead of
  // collapsing into one generic MCC/TBA answer.
  const uniqueStates = Array.from(new Set(selectedColleges.map((c) => c.state)));
  const verifiedRows = uniqueStates
    .map((state) => {
      const row = getAuthorityForState(state);
      if (!row) return null;
      return `
State: ${row.state}
  Official Counselling Authority: ${row.authority}
  Organization: ${row.organization}
  UG Portal: ${row.ugPortal || 'N/A'}
  PG Portal: ${row.pgPortal || 'N/A'}
  Official Website: ${row.officialWebsite}
  Registration Portal: ${row.registrationPortal || 'N/A'}
  Quota Type: ${row.quotaType}
  Notes: ${row.notes}`;
    })
    .filter(Boolean)
    .join('\n');

  const verifiedBlock = verifiedRows
    ? `
    ============================================================
    VERIFIED OFFICIAL DATA (GROUND TRUTH — DO NOT DEVIATE):
    ============================================================
    The following is confirmed, human-verified official counselling authority
    data for the state(s) involved in this request. This is more reliable
    than anything in your own training knowledge. You MUST use these exact
    URLs/authority names for any GOVERNMENT or GOVERNMENT-AIDED college in
    the matching state — do not substitute a different URL, do not guess,
    do not use a generic mcc.nic.in fallback if a specific state portal is
    given below.
    ${verifiedRows}
    ============================================================
    `
    : '';

  return `
    You are an expert medical admissions counselor specializing in Indian medical college
    admissions and NEET counselling authorities.

    The student has selected the following ${selectedColleges.length} college(s) for counselling:
    ${collegesListStr}

    Context: Exam = ${examName}, Category = ${targetCategory}, Course = ${targetCourse}.
    Today's date is 22 July 2026 — all dates you output must be realistic for the 2026
    counselling cycle.
    ${verifiedBlock}
    IMPORTANT: You MUST return a JSON array entry for EVERY SINGLE one of the
    ${selectedColleges.length} colleges listed above, in the same order, using the exact
    "college_id" given for each. Do not omit any college, do not merge two colleges into one
    entry, and do not add colleges that were not in the list.

    ============================================================
    RULE 1 — COLLEGE NAME MUST BE CLEAN
    ============================================================
    - "name" must be copied from the exact name given above — the real official name only.
    - NEVER append parenthetical hedges, confidence labels, or placeholders such as
      "(estimate)", "(approx)", "(unverified)", "(Private/Deemed-like estimate placeholder)".

    ============================================================
    RULE 2 — CONFIRM COLLEGE TYPE
    ============================================================
    - "collegeType": confirm or correct using your own knowledge, even if a hint was given.
      Must be exactly one of: "Government", "Private", "Deemed", "Government-Aided".

    ============================================================
    RULE 3 — OFFICIAL WEBSITE / AUTHORITY (use VERIFIED DATA above)
    ============================================================
    - For any GOVERNMENT or GOVERNMENT-AIDED college: "officialWebsite" MUST be set to
      the exact "Official Website" value from the VERIFIED OFFICIAL DATA block above for
      that college's state. Do not invent, guess, or substitute a different URL when a
      verified one is provided.
    - For CENTRAL institutes (AIIMS, JIPMER, central universities): use https://mcc.nic.in/
    - For DEEMED universities: use https://mcc.nic.in/ (Deemed/Central Universities pool)
    - For PRIVATE (self-financing, non-deemed) colleges: use the college's own real official
      website (its admission office), not a government portal — unless you know that specific
      private college's seats are actually routed through the state authority, in which case
      mention both.
    - If a state is NOT covered in the VERIFIED OFFICIAL DATA block above, use your own best,
      real knowledge — but still follow the same government/central/deemed/private routing
      logic, and never fabricate a URL that looks plausible but isn't real.

    ============================================================
    RULE 4 — NO GENERIC OR DUPLICATE TIMELINES
    ============================================================
    - NEVER output the same "events" array (same event names, same dates, same status) for
      two different colleges in this response. Since you now have real, distinct authority
      data per state (above), each college's timeline should naturally differ — use that.
    - Every event's "additionalDetails" must reference the SPECIFIC authority/portal/quota
      for that exact college (from the verified data where available) — not a generic phrase
      like "Deemed/Central Counselling Registration and Choice Filling" reused everywhere.
    - Give real, specific, differentiated dates based on typical patterns for that exact
      authority's real annual counselling cycle (e.g. KEA typically runs Round 1 in
      August, WBMCC on its own separate calendar, etc.) — mark these as "predicted" if
      estimated, "actual" only if you are confident they are real published dates.
    - Only use "counsellingDetail": null if a college genuinely has no counselling process
      at all to describe (e.g. a private college with pure direct-admission and no defined
      process) — not as a shortcut when you're simply unsure of dates. If unsure of dates,
      still give a realistic "predicted" timeline based on that authority's typical annual
      pattern rather than leaving it null or filling it with "TBA".
    - Before finalizing, compare every college's "events" array against every other
      college's — if any two are identical or near-identical, that means you defaulted to a
      template. Go back and use the correct state-specific authority/portal/quota details to
      differentiate them properly.

    ============================================================
    FIELD SPECIFICATIONS
    ============================================================
    For each selected college, provide:
    0. "college_id": Exact ID string from the list above (must match exactly).
    1. "name": Exact clean college name (Rule 1).
    2. "state": The state given above.
    3. "city": The city given above (or your best correction if you know it's wrong).
    4. "collegeType": One of "Government" | "Private" | "Deemed" | "Government-Aided" (Rule 2).
    5. "officialWebsite": Routed per Rule 3, using VERIFIED DATA where available.
    6. "counsellingDetail":
       - "type": "actual" (real known published dates) or "predicted" (realistic estimate
         based on that specific authority's typical yearly pattern).
       - "events": Chronological list, each with:
         - "startDate": "DD/MMM/YYYY" format (e.g. "10/Aug/2026") — give a real, specific
           predicted date based on the authority's typical cycle, not "TBA".
         - "endDate": Same format.
         - "event": Specific description naming the authority/quota/round (e.g. "KEA UG
           NEET Round 1 Choice Filling", "WBMCC PG Round 1 Registration", "BFUHS Round 2
           Seat Allotment").
         - "status": Exactly "completed", "current", or "upcoming" relative to 22 July 2026.
         - "additionalDetails": Specific notes referencing the real authority name/portal.

    Respond with ONLY a valid, plain JSON object in this exact format (no markdown, no
    commentary before or after):
    {
      "colleges": [
        {
          "college_id": "string",
          "name": "string",
          "state": "string",
          "city": "string",
          "collegeType": "Government" | "Private" | "Deemed" | "Government-Aided",
          "officialWebsite": "string",
          "counsellingDetail": {
            "type": "actual" | "predicted",
            "events": [
              {
                "startDate": "string",
                "endDate": "string",
                "event": "string",
                "status": "completed" | "current" | "upcoming",
                "additionalDetails": "string"
              }
            ]
          } | null
        }
      ]
    }
  `;
}

// export function collegeComparisonPrompt(collegesData: any[], targetCategory: string = 'Gen', examType: string = 'UG') {
//   const categoryName = targetCategory === 'Gen' ? 'General' : targetCategory;
//   const isPg = examType === 'PG';

//   const collegeListSummary = collegesData.map((c: any) => ({
//     name: c['College Name'] || c.name || '',
//     course: c['Course Name'] || (isPg ? 'MD/MS' : 'MBBS'),
//     city: c['City'] || c.city || '',
//     state: c['State'] || c.state || '',
//     type: c['Type'] || c.type || 'Government/Private',
//     board: c['Board'] || c.board || '',
//     seats: c['2026 Total Seats'] || c.seats || (isPg ? 3 : 150),
//     r1Cutoff: c[`Round 1 ${targetCategory}`] || c['Round 1 Gen'] || null,
//     r2Cutoff: c[`Round 2 ${targetCategory}`] || c['Round 2 Gen'] || null,
//     r3Cutoff: c[`Round 3 ${targetCategory}`] || c['Round 3 Gen'] || null,
//     strayCutoff: c[`Stray ${targetCategory}`] || c['Stray Gen'] || null,
//     rankRange: c['Overall Rank Range (All Rounds)'] || c['Overall Rank Range'] || '',
//   }));

//   return `
// You are an expert Indian Medical Education & NEET ${examType} Counselling advisor.
// The user wants to compare the following selected ${examType} medical colleges for Category: "${categoryName}":
// ${JSON.stringify(collegeListSummary, null, 2)}

// For EACH college in the list, provide accurate or realistic estimated data for NEET ${examType} under Category "${categoryName}":
// 1. "name": College Name
// 2. "loc": "City, State"
// 3. "address": Full physical street address with pincode (e.g. "EVR Periyar Salai, Park Town, Chennai, Tamil Nadu - 600003")
// 4. "fees": Total Annual Fees in INR as a pure number (e.g. 15000 for Govt, 1144000 for Pvt, 2500000 for Deemed)
// 5. "feesLabel": Human readable formatted fee string (e.g. "₹15,000 / yr" or "₹11.44L / yr")
// 6. "seats": Total MBBS Seats as pure number (e.g. 250)
// 7. "seatsLabel": Human readable formatted seats string (e.g. "250 seats")
// 8. "cutoff": Expected AIR ${categoryName} Cutoff rank as pure number (e.g. 5200 for Gen, 45000 for SC, 80000 for ST)
// 9. "cutoffLabel": Formatted cutoff string specifying Category (e.g. "AIR 5,200 (${categoryName})")
// 10. "hostel": Hostel Availability string ("Available", "Available (Boys & Girls)", etc.)
// 11. "hostelLabel": Detailed hostel description string
// 12. "accreditation": NAAC Accreditation & NIRF ranking string (e.g. "A+ Grade (NIRF #11)")

// Respond in JSON ONLY with format:
// {
//   "colleges": [
//     {
//       "name": "...",
//       "loc": "...",
//       "address": "...",
//       "fees": 15000,
//       "feesLabel": "...",
//       "seats": 250,
//       "seatsLabel": "...",
//       "cutoff": 5200,
//       "cutoffLabel": "AIR 5,200 (${categoryName})",
//       "hostel": "Available",
//       "hostelLabel": "...",
//       "accreditation": "..."
//     }
//   ]
// }
// `;
// }


export function collegeComparisonPrompt(collegesData: any[], targetCategory: string = 'Gen') {
  const categoryName = targetCategory === 'Gen' ? 'General' : targetCategory;

  const collegeListSummary = collegesData.map((c: any) => ({
    name: c['College Name'] || c.name || '',
    city: c['City'] || c.city || '',
    state: c['State'] || c.state || '',
    type: c['Type'] || c.type || 'Government/Private',
    board: c['Board'] || c.board || '',
    seats: c['2026 Total Seats'] || c.seats || 150,
    r1Cutoff: c[`Round 1 ${targetCategory}`] || c['Round 1 Gen'] || null,
    r2Cutoff: c[`Round 2 ${targetCategory}`] || c['Round 2 Gen'] || null,
    strayCutoff: c[`Stray ${targetCategory}`] || c['Stray Gen'] || null,
    rankRange: c['Overall Rank Range (All Rounds)'] || c['Overall Rank Range'] || '',
  }));

  return `
You are an expert Indian Medical Education & NEET UG Counselling advisor.
The user wants to compare the following selected MBBS medical colleges for Category: "${categoryName}":
${JSON.stringify(collegeListSummary, null, 2)}

For EACH college in the list, provide accurate or realistic estimated data for NEET UG under Category "${categoryName}":
1. "name": College Name
2. "loc": "City, State"
3. "address": Full physical street address with pincode (e.g. "EVR Periyar Salai, Park Town, Chennai, Tamil Nadu - 600003")
4. "fees": Total Annual Fees in INR as a pure number (e.g. 15000 for Govt, 1144000 for Pvt, 2500000 for Deemed)
5. "feesLabel": Human readable formatted fee string (e.g. "₹15,000 / yr" or "₹11.44L / yr")
6. "seats": Total MBBS Seats as pure number (e.g. 250)
7. "seatsLabel": Human readable formatted seats string (e.g. "250 seats")
8. "cutoff": Expected AIR ${categoryName} Cutoff rank as pure number (e.g. 5200 for Gen, 45000 for SC, 80000 for ST)
9. "cutoffLabel": Formatted cutoff string specifying Category (e.g. "AIR 5,200 (${categoryName})")
10. "aiq_cutoff": All India Quota rank number
11. "aiq_cutoffLabel": Formatted AIQ cutoff (e.g. "AIR 5,200 (15% All India Quota)")
12. "state_cutoff": State Domicile Quota rank number
13. "state_cutoffLabel": Formatted State Quota cutoff (e.g. "AIR 12,000 (85% State Quota)")
14. "management_cutoff": Institutional / Management Quota rank number
15. "management_cutoffLabel": Formatted Management Quota cutoff (e.g. "AIR 85,000 (Management Quota)" or "N/A (Govt Seats)")
16. "hostel": Hostel Availability string ("Available", "Available (Boys & Girls)", etc.)
17. "hostelLabel": Detailed hostel description string
18. "accreditation": NAAC Accreditation & NIRF ranking string (e.g. "A+ Grade (NIRF #11)")

Respond in JSON ONLY with format:
{
  "colleges": [
    {
      "name": "...",
      "loc": "...",
      "address": "...",
      "fees": 15000,
      "feesLabel": "...",
      "seats": 250,
      "seatsLabel": "...",
      "cutoff": 5200,
      "cutoffLabel": "AIR 5,200 (${categoryName})",
      "aiq_cutoff": 5200,
      "aiq_cutoffLabel": "AIR 5,200 (15% All India Quota)",
      "state_cutoff": 12000,
      "state_cutoffLabel": "AIR 12,000 (85% State Domicile Quota)",
      "management_cutoff": 999999,
      "management_cutoffLabel": "N/A (100% Government Seats)",
      "hostel": "Available",
      "hostelLabel": "...",
      "accreditation": "..."
    }
  ]
}
`;
}