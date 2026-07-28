// import { NextRequest, NextResponse } from 'next/server';
// import {
//   SUPPORTED_EXAMS,
//   INDIAN_STATES,
//   NEET_CATEGORIES,
//   ALL_COURSES,
//   getCoursesByExam,
//   AI_API_TO_USE
// } from '@/constants';
// import { predictCollegesWithGemini } from '@/lib/ai/gemini';
// import { predictCollegesWithPerplexity } from '@/lib/ai/perplexity';
// import { counsellingPrompt } from '@/lib/ai/prompts';
// import { getAuthorityForState } from '@/lib/ai/counsellingAuthorities';

// function parseCleanJson(text: string): any {
//   let cleaned = text.trim();
//   if (cleaned.startsWith('```json')) {
//     cleaned = cleaned.substring(7);
//   } else if (cleaned.startsWith('```')) {
//     cleaned = cleaned.substring(3);
//   }
//   if (cleaned.endsWith('```')) {
//     cleaned = cleaned.substring(0, cleaned.length - 3);
//   }
//   return JSON.parse(cleaned.trim());
// }

// async function callGeminiForCounselling(promptText: string) {
//   const apiKey = process.env.GEMINI_API_KEY || "";
//   if (!apiKey) {
//     throw new Error('Gemini API key is not configured.');
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
//           responseSchema: {
//             type: 'OBJECT',
//             properties: {
//               colleges: {
//                 type: 'ARRAY',
//                 items: {
//                   type: 'OBJECT',
//                   properties: {
//                     college_id: { type: 'STRING' },
//                     name: { type: 'STRING' },
//                     state: { type: 'STRING' },
//                     city: { type: 'STRING' },
//                     collegeType: {
//                       type: 'STRING',
//                       enum: ['Government', 'Private', 'Deemed', 'Government-Aided']
//                     },
//                     officialWebsite: { type: 'STRING' },
//                     counsellingDetail: {
//                       type: 'OBJECT',
//                       nullable: true,
//                       properties: {
//                         type: { type: 'STRING' },
//                         events: {
//                           type: 'ARRAY',
//                           items: {
//                             type: 'OBJECT',
//                             properties: {
//                               startDate: { type: 'STRING' },
//                               endDate: { type: 'STRING' },
//                               event: { type: 'STRING' },
//                               status: { type: 'STRING' },
//                               additionalDetails: { type: 'STRING' }
//                             },
//                             required: ['startDate', 'endDate', 'event', 'status']
//                           }
//                         }
//                       },
//                       required: ['type', 'events']
//                     }
//                   },
//                   required: ['college_id', 'name', 'state', 'city', 'collegeType', 'officialWebsite']
//                 }
//               }
//             },
//             required: ['colleges']
//           }
//         }
//       })
//     }
//   );

//   if (!response.ok) {
//     const errText = await response.text();
//     console.error('Gemini Counselling API Request failed:', errText);
//     throw new Error("Oops! We're experiencing a temporary issue while generating your NEET Predict data. Please try again in a few minutes. If you need immediate help, contact our experts.");
//   }

//   const resJson = await response.json();
//   const content = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
//   if (!content) {
//     throw new Error('Empty response from Gemini AI.');
//   }

//   try {
//     return parseCleanJson(content);
//   } catch (err) {
//     console.error('Failed to parse Clean JSON from Gemini counselling response:', err);
//     throw new Error('Failed to parse counselling data from Gemini AI.');
//   }
// }

// async function callPerplexityForCounselling(promptText: string) {
//   const apiKey = process.env.PERPLEXITY_API_KEY || "";
//   if (!apiKey) {
//     throw new Error('Perplexity API key is not configured.');
//   }

//   const response = await fetch('https://api.perplexity.ai/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${apiKey}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       model: 'sonar',
//       max_tokens: 8000,
//       temperature: 0.2,
//       messages: [
//         {
//           role: 'system',
//           content: 'You are a professional medical admissions counselor. You only respond with structured JSON output.'
//         },
//         {
//           role: 'user',
//           content: promptText
//         }
//       ],
//       response_format: {
//         type: 'json_schema',
//         json_schema: {
//           name: 'counselling_prediction',
//           schema: {
//             type: 'object',
//             properties: {
//               colleges: {
//                 type: 'array',
//                 items: {
//                   type: 'object',
//                   properties: {
//                     college_id: { type: 'string' },
//                     name: { type: 'string' },
//                     state: { type: 'string' },
//                     city: { type: 'string' },
//                     collegeType: {
//                       type: 'string',
//                       enum: ['Government', 'Private', 'Deemed', 'Government-Aided']
//                     },
//                     officialWebsite: { type: 'string' },
//                     counsellingDetail: {
//                       type: 'object',
//                       properties: {
//                         type: { type: 'string' },
//                         events: {
//                           type: 'array',
//                           items: {
//                             type: 'object',
//                             properties: {
//                              startDate: { type: 'string' },
//                              endDate: { type: 'string' },
//                              event: { type: 'string' },
//                              status: { type: 'string' },
//                              additionalDetails: { type: 'string' }
//                            },
//                            required: ['startDate', 'endDate', 'event', 'status']
//                           }
//                         }
//                       },
//                       required: ['type', 'events']
//                     }
//                   },
//                   required: ['college_id', 'name', 'state', 'city', 'collegeType', 'officialWebsite']
//                 }
//               }
//             },
//             required: ['colleges']
//           }
//         }
//       }
//     })
//   });

//   if (!response.ok) {
//     const errText = await response.text();
//     console.error('Perplexity Counselling API Request failed:', errText);
//     throw new Error('Perplexity AI Service is temporarily offline. Please try again.');
//   }

//   const resJson = await response.json();
//   const content = resJson.choices?.[0]?.message?.content;
//   if (!content) {
//     throw new Error('Empty response from Perplexity AI.');
//   }

//   try {
//     return parseCleanJson(content);
//   } catch (err) {
//     console.error('Failed to parse Clean JSON from Perplexity counselling response:', err);
//     throw new Error('Failed to parse counselling data from Perplexity AI.');
//   }
// }

// /**
//  * NEET rank logic: a LOWER rank number is better. A college's closing cutoff
//  * of, say, 75,000 means the last admitted candidate had rank 75,000. Anyone
//  * with a WORSE (higher) rank than that did not get in that year — they are
//  * NOT ELIGIBLE, not "Medium chance." AI models frequently get this backwards
// function computeChance(rankNum: number, closingRank: number): 'High' | 'Medium' | 'Reach' {
//   if (!closingRank || closingRank <= 0) return 'Reach';

//   if (rankNum <= closingRank) {
//     return 'High';
//   }

//   const diff = rankNum - closingRank;
//   if (diff <= 350 || diff / closingRank <= 0.08) {
//     return 'Medium';
//   }

//   return 'Reach';
// }

// /**
//  * Normalizes whatever collegeType-ish value the AI returned into one of our
//  * four canonical values. AI models are inconsistent about casing/wording
//  * ("govt", "self-financing", "private medical college", etc.), so we do
//  * simple keyword matching rather than trusting an exact string match.
//  */
// function normalizeCollegeType(raw: string | undefined | null): 'Government' | 'Private' | 'Deemed' | 'Government-Aided' {
//   const val = (raw || '').toLowerCase();
//   if (val.includes('deemed')) return 'Deemed';
//   if (val.includes('aided')) return 'Government-Aided';
//   if (val.includes('private') || val.includes('self-financ') || val.includes('trust') || val.includes('management')) return 'Private';
//   if (val.includes('government') || val.includes('govt') || val.includes('state') || val.includes('central')) return 'Government';
//   return 'Government'; // conservative default only when the AI gave nothing usable
// }

// /**
//  * Strips duplicate events from counselling detail.
//  */
// function stripDuplicateGenericCounselling(aiData: any) {
//   if (!aiData || !Array.isArray(aiData.colleges)) return aiData;
//   aiData.colleges = aiData.colleges.map((col: any) => {
//     if (col.counsellingDetail && Array.isArray(col.counsellingDetail.events)) {
//       const seen = new Set<string>();
//       const uniqueEvents = col.counsellingDetail.events.filter((ev: any) => {
//         const key = `${ev.event || ''}-${ev.startDate || ''}-${ev.endDate || ''}`.toLowerCase().trim();
//         if (seen.has(key)) return false;
//         seen.add(key);
//         return true;
//       });
//       col.counsellingDetail.events = uniqueEvents;
//     }
//     return col;
//   });
//   return aiData;
// }

// /**
//  * Final server-side enforcement: for Government/Government-Aided colleges,
//  * always overwrite officialWebsite with our verified data if we have a row
//  * for that state — regardless of what the AI returned. This guarantees
//  * correctness even if the AI ignored the prompt's verified-data instruction.
//  */
// function enforceVerifiedWebsite(college: { state: string; collegeType: string; officialWebsite?: string }): string {
//   const type = (college.collegeType || '').toLowerCase();
//   if (type !== 'government' && type !== 'government-aided') {
//     return college.officialWebsite || ''; // private/deemed/central — leave AI's answer or existing correction logic
//   }
//   const row = getAuthorityForState(college.state);
//   return row ? row.officialWebsite : (college.officialWebsite || '');
// }

// /**
//  * Strips any parenthetical AI commentary/placeholder text that sometimes
//  * leaks into the college name field, e.g.:
//  *   "NSCB Medical College (Private/Deemed-like estimate placeholder)"
//  * becomes:
//  *   "NSCB Medical College"
//  *
//  * Only strips parentheticals containing flag words that indicate AI
//  * meta-commentary, so legitimate parts of a real name (e.g. a city in
//  * parentheses) are left alone.
//  */
// function sanitizeCollegeName(rawName: string): string {
//   if (!rawName) return rawName;

//   const metaFlagWords = [
//     'estimate', 'placeholder', 'approx', 'unverified', 'guess',
//     'assumed', 'predicted', 'like estimate', 'uncertain', 'unconfirmed',
//     'tbd', 'n/a', 'not confirmed', 'best guess', 'hypothetical'
//   ];

//   let cleaned = rawName.replace(/\(([^()]*)\)/g, (match, inner) => {
//     const innerLower = inner.toLowerCase();
//     const isMeta = metaFlagWords.some((w) => innerLower.includes(w));
//     return isMeta ? '' : match;
//   });

//   cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();
//   cleaned = cleaned.replace(/[-–,]\s*$/, '').trim();

//   return cleaned;
// }

// /**
//  * Detects the "echo hallucination" pattern where the AI copies the
//  * student's own rank back as the cutoffRank for most/all colleges instead
//  * of returning real historical cutoffs (e.g. rank 3 -> every college shows
//  * cutoff ~3). If more than half of all returned cutoff values are
//  * suspiciously close to the input rank, we treat the whole response as
//  * unusable so the caller can retry with the fallback provider.
//  */
// function detectHallucinatedCutoffs(aiData: any, rankNum: number): boolean {
//   if (!aiData) return false;
//   const list = aiData.colleges || aiData.results || [];
//   if (!Array.isArray(list) || list.length === 0) return false;

//   const allRanks: number[] = [];
//   for (const c of list) {
//     if (Array.isArray(c.cutoffs)) {
//       for (const cut of c.cutoffs) {
//         allRanks.push(cut.closing_rank ?? cut.cutoffRank ?? 0);
//       }
//     }
//     if (Array.isArray(c.courses)) {
//       for (const crs of c.courses) {
//         if (Array.isArray(crs.categories)) {
//           for (const cat of crs.categories) {
//             allRanks.push(cat.cutoffRank ?? cat.closing_rank ?? 0);
//           }
//         }
//       }
//     }
//   }

//   if (allRanks.length < 3) return false;

//   const tolerance = Math.max(5, rankNum * 0.05);
//   const echoCount = allRanks.filter((r) => Math.abs(r - rankNum) <= tolerance).length;

//   return echoCount / allRanks.length > 0.5;
// }

// /**
//  * Enforces the person's selected states server-side. The AI is only ever
//  * given the state names as a hint in its prompt — it frequently ignores that
//  * hint and returns colleges from other states anyway. This strips those out
//  * for real, using simple case-insensitive name matching against state_name.
//  *
//  * A selection of 'AI' (All India Quota) — or no states selected at all — is
//  * treated as "no restriction", since All India Quota seats aren't tied to a
//  * single state.
//  */
// function filterByStates(aiData: any, selectedStateCodes: string[], preferredStateNames: string[]) {
//   if (!aiData) return aiData;

//   const noRestriction =
//     selectedStateCodes.length === 0 ||
//     (selectedStateCodes.length === 1 && selectedStateCodes.includes('AI'));
//   if (noRestriction) return aiData;

//   const listKey = Array.isArray(aiData.colleges)
//     ? 'colleges'
//     : Array.isArray(aiData.results)
//     ? 'results'
//     : null;
//   if (!listKey) return aiData;

//   const wantedStates = preferredStateNames
//     .filter(s => s !== 'All India Quota' && s !== 'AI')
//     .map((s) => s.toLowerCase().trim());

//   const filteredList = aiData[listKey].filter((college: any) => {
//     const collegeState = (college.state_name || college.state || '').toLowerCase().trim();
//     if (!collegeState) return false;
//     return wantedStates.some(
//       (wanted) => collegeState.includes(wanted) || wanted.includes(collegeState)
//     );
//   });

//   return { ...aiData, [listKey]: filteredList };
// }

// /**
//  * Walks the AI's response, drops any cutoff row the rank doesn't actually
//  * qualify for, recomputes best_chance for every surviving row from the real
//  * numbers, and recalculates each college's summary (closest_cutoff /
//  * best_chance) from only the eligible rows. Colleges left with zero eligible
//  * rows are removed entirely, so a rank of 90,000 will never see a college
//  * whose cutoff is 75,000. Also cleans the college's display name so no
//  * AI meta-commentary reaches the UI (see sanitizeCollegeName above).
//  */
// function sanitizeCollegeData(aiData: any, rankNum: number) {
//   if (!aiData) return aiData;

//   const listKey = Array.isArray(aiData.colleges)
//     ? 'colleges'
//     : Array.isArray(aiData.results)
//     ? 'results'
//     : null;

//   if (!listKey) return aiData;

//   const chanceRank: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

//   const sanitizedList = aiData[listKey]
//     .map((college: any, idx: number) => {
//       const updatedCollege: any = { ...college };

//       const rawName = college.college_name || college.name || `college-${idx}`;
//       const cName = sanitizeCollegeName(rawName);
//       updatedCollege.college_id = college.college_id || `${cName.replace(/\s+/g, '-').toLowerCase()}-${idx}`;
//       updatedCollege.college_name = cName;
//       updatedCollege.name = cName;
//       updatedCollege.state_name = college.state_name || college.state || 'All India';
//       updatedCollege.city_name = college.city_name || college.city || '';
//       updatedCollege.college_type = normalizeCollegeType(college.collegeType || college.college_type);

//       const eligibleRanks: number[] = [];
//       const eligibleChances: string[] = [];

//       // Shape A: flat cutoffs array — [{ course_name, category_name, closing_rank, best_chance }]
//       if (Array.isArray(college.cutoffs)) {
//         const filteredCutoffs = college.cutoffs
//           .map((cut: any) => {
//             const closingRank = cut.closing_rank ?? cut.cutoffRank ?? 0;
//             const chance = computeChance(rankNum, closingRank);
//             if (chance === null) return null; // not eligible for this course/category — drop it
//             eligibleRanks.push(closingRank);
//             eligibleChances.push(chance);
//             return { ...cut, closing_rank: closingRank, best_chance: chance };
//           })
//           .filter(Boolean);
//         updatedCollege.cutoffs = filteredCutoffs;
//       }

//       // Shape B: nested courses -> categories — [{ course, categories: [{ category, cutoffRank, chanceOfAdmission }] }]
//       if (Array.isArray(college.courses)) {
//         const filteredCourses = college.courses
//           .map((crs: any) => {
//             if (!Array.isArray(crs.categories)) return crs;
//             const filteredCategories = crs.categories
//               .map((cat: any) => {
//                 const closingRank = cat.cutoffRank ?? cat.closing_rank ?? 0;
//                 const chance = computeChance(rankNum, closingRank);
//                 if (chance === null) return null; // not eligible — drop it
//                 eligibleRanks.push(closingRank);
//                 eligibleChances.push(chance);
//                 return { ...cat, cutoffRank: closingRank, chanceOfAdmission: chance };
//               })
//               .filter(Boolean);
//             return { ...crs, categories: filteredCategories };
//           })
//           .filter((crs: any) => (Array.isArray(crs.categories) ? crs.categories.length > 0 : true));
//         updatedCollege.courses = filteredCourses;
//       }

//       // No course/category at this college clears the user's rank -> drop the whole college
//       if (eligibleRanks.length === 0) return null;

//       // Recompute the college-level summary strictly from the surviving eligible rows
//       updatedCollege.closest_cutoff = Math.min(...eligibleRanks);
//       updatedCollege.best_chance = eligibleChances.reduce(
//         (best, cur) => (chanceRank[cur] > chanceRank[best] ? cur : best),
//         eligibleChances[0]
//       );

//       return updatedCollege;
//     })
//     .filter(Boolean);

//   return { ...aiData, [listKey]: sanitizedList };
// }

// // POST /api/ai-predict-colleges
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { action } = body;

//     if (action === 'counselling') {
//       const { selectedColleges, examType, category, course } = body;
//       if (!Array.isArray(selectedColleges) || selectedColleges.length === 0) {
//         return NextResponse.json({ error: 'Please select at least one college for counselling prediction.' }, { status: 400 });
//       }

//       const examName = examType || 'NEET_UG';
//       const promptText = counsellingPrompt(selectedColleges, examName, category || 'ALL', course || 'MBBS');

//       let aiData;
//       const usePerplexityFirst = AI_API_TO_USE === 'perplexity';

//       try {
//         if (usePerplexityFirst) {
//           aiData = await callPerplexityForCounselling(promptText);
//         } else {
//           aiData = await callGeminiForCounselling(promptText);
//         }
//       } catch (primaryErr: any) {
//         console.warn('Primary AI counselling predictor failed, attempting fallback...', primaryErr?.message);
//         try {
//           if (usePerplexityFirst) {
//             aiData = await callGeminiForCounselling(promptText);
//           } else if (process.env.PERPLEXITY_API_KEY) {
//             aiData = await callPerplexityForCounselling(promptText);
//           } else {
//             throw primaryErr;
//           }
//         } catch {
//           throw primaryErr;
//         }
//       }

//       if (aiData && Array.isArray(aiData.colleges)) {
//         aiData.colleges = aiData.colleges.map((col: any) => {
//           const cleanName = sanitizeCollegeName(col.name);
//           const normalizedType = normalizeCollegeType(col.collegeType);
//           const correctedUrl = enforceVerifiedWebsite({
//             state: col.state,
//             collegeType: normalizedType,
//             officialWebsite: col.officialWebsite
//           });
//           const auth = getAuthorityForState(col.state);
//           return {
//             ...col,
//             name: cleanName,
//             collegeType: normalizedType,
//             officialWebsite: correctedUrl,
//             authorityInfo: auth ? {
//               authority: auth.authority,
//               organization: auth.organization,
//               ugPortal: auth.ugPortal,
//               pgPortal: auth.pgPortal,
//               officialWebsite: auth.officialWebsite,
//               counsellingPortal: auth.counsellingPortal,
//               notificationPage: auth.notificationPage,
//               quotaType: auth.quotaType,
//               notes: auth.notes
//             } : null
//           };
//         });

//         aiData = stripDuplicateGenericCounselling(aiData);
//       }

//       return NextResponse.json(aiData);
//     }

//     const { rank, states, category, courses, course, examType } = body;

//     const rankNum = typeof rank === 'number' && rank > 0 ? rank : null;
//     if (rankNum === null) {
//       return NextResponse.json({ error: 'Please enter a valid rank score for AI prediction.' }, { status: 400 });
//     }

//     const selectedExamCode = examType || 'NEET_UG';
//     const examMetadata = SUPPORTED_EXAMS.find(e => e.code === selectedExamCode) || SUPPORTED_EXAMS[0];
//     const examName = examMetadata.name;

//     // Handle course/courses selection
//     const rawCourse = courses || course;
//     let selectedCourseCodes: string[] = [];
//     if (Array.isArray(rawCourse)) {
//       selectedCourseCodes = rawCourse;
//     } else if (typeof rawCourse === 'string' && rawCourse !== 'ALL' && rawCourse.trim() !== '') {
//       selectedCourseCodes = [rawCourse];
//     } else {
//       const availableCourses = getCoursesByExam(selectedExamCode as any);
//       selectedCourseCodes = availableCourses.map(c => c.code);
//     }

//     const targetCoursesList = selectedCourseCodes.map(code => {
//       const match = ALL_COURSES.find(c => c.code === code);
//       return match ? `${match.name} (${match.code})` : code;
//     });
//     const targetCoursesStr = targetCoursesList.length > 0 ? targetCoursesList.join(', ') : 'All Courses (MBBS, BDS, BAMS)';

//     // Map state codes to state names
//     const selectedStateCodes = Array.isArray(states) ? states : [];
//     const preferredStatesList = selectedStateCodes.map(code => {
//       const match = INDIAN_STATES.find(s => s.code === code);
//       return match ? match.name : code;
//     });
//     const preferredStateStr = preferredStatesList.length > 0 ? preferredStatesList.join(', ') : 'All India Quota';

//     // Map category code to category name
//     const targetCategory = category && category !== 'ALL'
//       ? (NEET_CATEGORIES.find(c => c.code === category)?.name || category)
//       : 'All Categories (UR, OBC, SC, ST, EWS)';

//     const usePerplexityFirst = AI_API_TO_USE === 'perplexity';

//     const callPrimary = () =>
//       usePerplexityFirst
//         ? predictCollegesWithPerplexity(rankNum, examName, examMetadata, targetCategory, targetCoursesStr, preferredStateStr)
//         : predictCollegesWithGemini(rankNum, examName, examMetadata, targetCategory, targetCoursesStr, preferredStateStr);

//     const callFallback = () =>
//       usePerplexityFirst
//         ? predictCollegesWithGemini(rankNum, examName, examMetadata, targetCategory, targetCoursesStr, preferredStateStr)
//         : predictCollegesWithPerplexity(rankNum, examName, examMetadata, targetCategory, targetCoursesStr, preferredStateStr);

//     let aiData;

//     try {
//       aiData = await callPrimary();

//       if (detectHallucinatedCutoffs(aiData, rankNum)) {
//         console.warn('Detected hallucinated/echoed cutoffs from primary AI provider, retrying with fallback...');
//         const fallbackHasKey = usePerplexityFirst ? !!process.env.GEMINI_API_KEY : !!process.env.PERPLEXITY_API_KEY;
//         if (fallbackHasKey) {
//           const fallbackData = await callFallback();
//           if (!detectHallucinatedCutoffs(fallbackData, rankNum)) {
//             aiData = fallbackData;
//           }
//         }
//       }
//     } catch (primaryErr: any) {
//       console.warn('Primary AI college predictor failed, attempting fallback...', primaryErr?.message);
//       try {
//         const fallbackHasKey = usePerplexityFirst ? !!process.env.GEMINI_API_KEY : !!process.env.PERPLEXITY_API_KEY;
//         if (fallbackHasKey) {
//           aiData = await callFallback();
//         } else {
//           throw primaryErr;
//         }
//       } catch {
//         throw primaryErr;
//       }
//     }

//     // Deterministically correct/filter the AI's output using the actual rank
//     // vs cutoff numbers, instead of trusting whatever chance label it guessed.
//     aiData = sanitizeCollegeData(aiData, rankNum);

//     // Enforce the person's selected states for real — don't rely on the AI
//     // having honored the state hint in its prompt.
//     aiData = filterByStates(aiData, selectedStateCodes, preferredStatesList);

//     return NextResponse.json(aiData);
//   } catch (error: any) {
//     console.error('Predict Colleges AI Error:', error);
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//     return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import {
  SUPPORTED_EXAMS,
  INDIAN_STATES,
  NEET_CATEGORIES,
  ALL_COURSES,
  getCoursesByExam,
  AI_API_TO_USE
} from '@/constants';
import { predictCollegesWithGemini } from '@/lib/ai/gemini';
import { predictCollegesWithPerplexity } from '@/lib/ai/perplexity';
import { counsellingPrompt } from '@/lib/ai/prompts';
import { getAuthorityForState } from '@/lib/ai/counsellingAuthorities';
import { KARNATAKA_PG_COLLEGES } from '@/lib/data/KarnatakaState/pgCollegeList';
import { KARNATAKA_UG_COLLEGES } from '@/lib/data/KarnatakaState/ugCollegeList';
import { ALLSTATE_PG_COLLEGES } from '@/lib/data/allstate/pgCollegeList';
import { ALLSTATE_UG_COLLEGES } from '@/lib/data/allstate/ugCollegeList';

function parseCleanJson(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return JSON.parse(cleaned.trim());
}

async function callGeminiForCounselling(promptText: string) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
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
          responseSchema: {
            type: 'OBJECT',
            properties: {
              colleges: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    college_id: { type: 'STRING' },
                    name: { type: 'STRING' },
                    state: { type: 'STRING' },
                    city: { type: 'STRING' },
                    collegeType: {
                      type: 'STRING',
                      enum: ['Government', 'Private', 'Deemed', 'Government-Aided']
                    },
                    officialWebsite: { type: 'STRING' },
                    counsellingDetail: {
                      type: 'OBJECT',
                      nullable: true,
                      properties: {
                        type: { type: 'STRING' },
                        events: {
                          type: 'ARRAY',
                          items: {
                            type: 'OBJECT',
                            properties: {
                              startDate: { type: 'STRING' },
                              endDate: { type: 'STRING' },
                              event: { type: 'STRING' },
                              status: { type: 'STRING' },
                              additionalDetails: { type: 'STRING' }
                            },
                            required: ['startDate', 'endDate', 'event', 'status']
                          }
                        }
                      },
                      required: ['type', 'events']
                    }
                  },
                  required: ['college_id', 'name', 'state', 'city', 'collegeType', 'officialWebsite']
                }
              }
            },
            required: ['colleges']
          }
        }
      })
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error('Gemini Counselling API Request failed:', errText);
    throw new Error("Oops! We're experiencing a temporary issue while generating your NEET Predict data. Please try again in a few minutes. If you need immediate help, contact our experts.");
  }

  const resJson = await response.json();
  const content = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error('Empty response from Gemini AI.');
  }

  try {
    return parseCleanJson(content);
  } catch (err) {
    console.error('Failed to parse Clean JSON from Gemini counselling response:', err);
    throw new Error('Failed to parse counselling data from Gemini AI.');
  }
}

async function callPerplexityForCounselling(promptText: string) {
  const apiKey = process.env.PERPLEXITY_API_KEY || "";
  if (!apiKey) {
    throw new Error('Perplexity API key is not configured.');
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      max_tokens: 8000,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: 'You are a professional medical admissions counselor. You only respond with structured JSON output.'
        },
        {
          role: 'user',
          content: promptText
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'counselling_prediction',
          schema: {
            type: 'object',
            properties: {
              colleges: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    college_id: { type: 'string' },
                    name: { type: 'string' },
                    state: { type: 'string' },
                    city: { type: 'string' },
                    collegeType: {
                      type: 'string',
                      enum: ['Government', 'Private', 'Deemed', 'Government-Aided']
                    },
                    officialWebsite: { type: 'string' },
                    counsellingDetail: {
                      type: 'object',
                      properties: {
                        type: { type: 'string' },
                        events: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                             startDate: { type: 'string' },
                             endDate: { type: 'string' },
                             event: { type: 'string' },
                             status: { type: 'string' },
                             additionalDetails: { type: 'string' }
                           },
                           required: ['startDate', 'endDate', 'event', 'status']
                          }
                        }
                      },
                      required: ['type', 'events']
                    }
                  },
                  required: ['college_id', 'name', 'state', 'city', 'collegeType', 'officialWebsite']
                }
              }
            },
            required: ['colleges']
          }
        }
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Perplexity Counselling API Request failed:', errText);
    throw new Error('Perplexity AI Service is temporarily offline. Please try again.');
  }

  const resJson = await response.json();
  const content = resJson.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from Perplexity AI.');
  }

  try {
    return parseCleanJson(content);
  } catch (err) {
    console.error('Failed to parse Clean JSON from Perplexity counselling response:', err);
    throw new Error('Failed to parse counselling data from Perplexity AI.');
  }
}

/**
 * A cutoffRank that is essentially identical to the student's own rank is
 * never a real historical data point for that college — it means the AI
 * echoed the input back instead of returning actual historical data. This
 * happens most often for extreme/rare ranks (e.g. AIR 1–50) where no real
 * dataset of "the college that closed at rank 3" actually exists, so the
 * model falls back to parroting the question. We treat any cutoff this
 * close to the student's rank as unusable, exactly like "not eligible",
 * rather than let it produce a fake "Low Chance / Closing Cutoff: 1" card.
 */
function isLikelyEchoedRank(rankNum: number, closingRank: number): boolean {
  const tolerance = Math.max(5, rankNum * 0.05);
  return Math.abs(closingRank - rankNum) <= tolerance;
}

/**
 * NEET rank logic: a LOWER rank number is better. A college's closing cutoff
 * of, say, 75,000 means the last admitted candidate had rank 75,000. Anyone
 * with a WORSE (higher) rank than that did not get in that year — they are
 * NOT ELIGIBLE, not "Medium chance." AI models frequently get this backwards
 * or just hallucinate a chance label, so we never trust the AI's own
 * best_chance/chanceOfAdmission value — we always recompute it here from the
 * actual numbers, and drop anything the user's rank does not actually clear.
 *
 * We also reject any cutoff that looks like an echo of the student's own
 * rank (see isLikelyEchoedRank above) BEFORE doing the eligibility math —
 * this is what stops a rank of 1 from showing every college's cutoff as "1".
 */
function computeChance(rankNum: number, closingRank: number): string | null {
  if (!closingRank || closingRank <= 0) return null;
  if (isLikelyEchoedRank(rankNum, closingRank)) return null;

  // High Chance: Student rank is better than or equal to closing cutoff (e.g. rank 5000 <= cutoff 6100)
  if (rankNum <= closingRank) {
    return 'High';
  }

  // Medium Chance: Student rank is slightly worse than closing cutoff (e.g. cutoff 4800..4990 for rank 5000)
  const diff = rankNum - closingRank;
  if (diff <= 350 || diff / closingRank <= 0.08) {
    return 'Medium';
  }

  // Low Chance / Reach: Student rank is worse than closing cutoff by a larger margin (e.g. cutoff < 4800 for rank 5000)
  return 'Reach';
}

/**
 * Normalizes whatever collegeType-ish value the AI returned into one of our
 * four canonical values. AI models are inconsistent about casing/wording
 * ("govt", "self-financing", "private medical college", etc.), so we do
 * simple keyword matching rather than trusting an exact string match.
 */
function normalizeCollegeType(raw: string | undefined | null): 'Government' | 'Private' | 'Deemed' | 'Government-Aided' {
  const val = (raw || '').toLowerCase();
  if (val.includes('deemed')) return 'Deemed';
  if (val.includes('aided')) return 'Government-Aided';
  if (val.includes('private') || val.includes('self-financ') || val.includes('trust') || val.includes('management')) return 'Private';
  if (val.includes('government') || val.includes('govt') || val.includes('state') || val.includes('central')) return 'Government';
  return 'Government'; // conservative default only when the AI gave nothing usable
}

/**
 * Strips duplicate events from counselling detail.
 */
function stripDuplicateGenericCounselling(aiData: any) {
  if (!aiData || !Array.isArray(aiData.colleges)) return aiData;
  aiData.colleges = aiData.colleges.map((col: any) => {
    if (col.counsellingDetail && Array.isArray(col.counsellingDetail.events)) {
      const seen = new Set<string>();
      const uniqueEvents = col.counsellingDetail.events.filter((ev: any) => {
        const key = `${ev.event || ''}-${ev.startDate || ''}-${ev.endDate || ''}`.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      col.counsellingDetail.events = uniqueEvents;
    }
    return col;
  });
  return aiData;
}

/**
 * Final server-side enforcement: for Government/Government-Aided colleges,
 * always overwrite officialWebsite with our verified data if we have a row
 * for that state — regardless of what the AI returned. This guarantees
 * correctness even if the AI ignored the prompt's verified-data instruction.
 */
function enforceVerifiedWebsite(college: { state: string; collegeType: string; officialWebsite?: string }): string {
  const type = (college.collegeType || '').toLowerCase();
  if (type !== 'government' && type !== 'government-aided') {
    return college.officialWebsite || ''; // private/deemed/central — leave AI's answer or existing correction logic
  }
  const row = getAuthorityForState(college.state);
  return row ? row.officialWebsite : (college.officialWebsite || '');
}

/**
 * Strips any parenthetical AI commentary/placeholder text that sometimes
 * leaks into the college name field, e.g.:
 *   "NSCB Medical College (Private/Deemed-like estimate placeholder)"
 * becomes:
 *   "NSCB Medical College"
 *
 * Only strips parentheticals containing flag words that indicate AI
 * meta-commentary, so legitimate parts of a real name (e.g. a city in
 * parentheses) are left alone.
 */
function sanitizeCollegeName(rawName: string): string {
  if (!rawName) return rawName;

  const metaFlagWords = [
    'estimate', 'placeholder', 'approx', 'unverified', 'guess',
    'assumed', 'predicted', 'like estimate', 'uncertain', 'unconfirmed',
    'tbd', 'n/a', 'not confirmed', 'best guess', 'hypothetical'
  ];

  let cleaned = rawName.replace(/\(([^()]*)\)/g, (match, inner) => {
    const innerLower = inner.toLowerCase();
    const isMeta = metaFlagWords.some((w) => innerLower.includes(w));
    return isMeta ? '' : match;
  });

  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();
  cleaned = cleaned.replace(/[-–,]\s*$/, '').trim();

  return cleaned;
}

/**
 * Detects the "echo hallucination" pattern where the AI copies the
 * student's own rank back as the cutoffRank for most/all colleges instead
 * of returning real historical cutoffs (e.g. rank 3 -> every college shows
 * cutoff ~3). If more than half of all returned cutoff values are
 * suspiciously close to the input rank, we treat the whole response as
 * unusable so the caller can retry with the fallback provider.
 */
function detectHallucinatedCutoffs(aiData: any, rankNum: number): boolean {
  if (!aiData) return false;
  const list = aiData.colleges || aiData.results || [];
  if (!Array.isArray(list) || list.length === 0) return false;

  const allRanks: number[] = [];
  for (const c of list) {
    if (Array.isArray(c.cutoffs)) {
      for (const cut of c.cutoffs) {
        allRanks.push(cut.closing_rank ?? cut.cutoffRank ?? 0);
      }
    }
    if (Array.isArray(c.courses)) {
      for (const crs of c.courses) {
        if (Array.isArray(crs.categories)) {
          for (const cat of crs.categories) {
            allRanks.push(cat.cutoffRank ?? cat.closing_rank ?? 0);
          }
        }
      }
    }
  }

  if (allRanks.length < 3) return false;

  const tolerance = Math.max(5, rankNum * 0.05);
  const echoCount = allRanks.filter((r) => Math.abs(r - rankNum) <= tolerance).length;

  return echoCount / allRanks.length > 0.5;
}

/**
 * Enforces the person's selected states server-side. The AI is only ever
 * given the state names as a hint in its prompt — it frequently ignores that
 * hint and returns colleges from other states anyway. This strips those out
 * for real, using simple case-insensitive name matching against state_name.
 *
 * A selection of 'AI' (All India Quota) — or no states selected at all — is
 * treated as "no restriction", since All India Quota seats aren't tied to a
 * single state.
 */
function filterByStates(aiData: any, selectedStateCodes: string[], preferredStateNames: string[]) {
  if (!aiData) return aiData;

  const noRestriction =
    selectedStateCodes.length === 0 ||
    (selectedStateCodes.length === 1 && selectedStateCodes.includes('AI'));
  if (noRestriction) return aiData;

  const listKey = Array.isArray(aiData.colleges)
    ? 'colleges'
    : Array.isArray(aiData.results)
    ? 'results'
    : null;
  if (!listKey) return aiData;

  const wantedStates = preferredStateNames
    .filter(s => s !== 'All India Quota' && s !== 'AI')
    .map((s) => s.toLowerCase().trim());

  const filteredList = aiData[listKey].filter((college: any) => {
    const collegeState = (college.state_name || college.state || '').toLowerCase().trim();
    if (!collegeState) return false;
    return wantedStates.some(
      (wanted) => collegeState.includes(wanted) || wanted.includes(collegeState)
    );
  });

  return { ...aiData, [listKey]: filteredList };
}

/**
 * Walks the AI's response, drops any cutoff row the rank doesn't actually
 * qualify for (including echoed/hallucinated cutoffs — see computeChance
 * above), recomputes best_chance for every surviving row from the real
 * numbers, and recalculates each college's summary (closest_cutoff /
 * best_chance) from only the eligible rows. Colleges left with zero eligible
 * rows are removed entirely, so a rank of 90,000 will never see a college
 * whose cutoff is 75,000 — and a rank of 1 will never see a fake "cutoff: 1"
 * card either. Also cleans the college's display name so no AI
 * meta-commentary reaches the UI (see sanitizeCollegeName above).
 */
function sanitizeCollegeData(aiData: any, rankNum: number) {
  if (!aiData) return aiData;

  const listKey = Array.isArray(aiData.colleges)
    ? 'colleges'
    : Array.isArray(aiData.results)
    ? 'results'
    : null;

  if (!listKey) return aiData;

  const chanceRank: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

  const sanitizedList = aiData[listKey]
    .map((college: any, idx: number) => {
      const updatedCollege: any = { ...college };

      const rawName = college.college_name || college.name || `college-${idx}`;
      const cName = sanitizeCollegeName(rawName);
      updatedCollege.college_id = college.college_id || `${cName.replace(/\s+/g, '-').toLowerCase()}-${idx}`;
      updatedCollege.college_name = cName;
      updatedCollege.name = cName;
      updatedCollege.state_name = college.state_name || college.state || 'All India';
      updatedCollege.city_name = college.city_name || college.city || '';
      updatedCollege.college_type = normalizeCollegeType(college.collegeType || college.college_type);

      const eligibleRanks: number[] = [];
      const eligibleChances: string[] = [];

      // Shape A: flat cutoffs array — [{ course_name, category_name, closing_rank, best_chance }]
      if (Array.isArray(college.cutoffs)) {
        const filteredCutoffs = college.cutoffs
          .map((cut: any) => {
            const closingRank = cut.closing_rank ?? cut.cutoffRank ?? 0;
            const chance = computeChance(rankNum, closingRank);
            if (chance === null) return null; // not eligible / echoed value — drop it
            eligibleRanks.push(closingRank);
            eligibleChances.push(chance);
            return { ...cut, closing_rank: closingRank, best_chance: chance };
          })
          .filter(Boolean);
        updatedCollege.cutoffs = filteredCutoffs;
      }

      // Shape B: nested courses -> categories — [{ course, categories: [{ category, cutoffRank, chanceOfAdmission }] }]
      if (Array.isArray(college.courses)) {
        const filteredCourses = college.courses
          .map((crs: any) => {
            if (!Array.isArray(crs.categories)) return crs;
            const filteredCategories = crs.categories
              .map((cat: any) => {
                const closingRank = cat.cutoffRank ?? cat.closing_rank ?? 0;
                const chance = computeChance(rankNum, closingRank);
                if (chance === null) return null; // not eligible / echoed value — drop it
                eligibleRanks.push(closingRank);
                eligibleChances.push(chance);
                return { ...cat, cutoffRank: closingRank, chanceOfAdmission: chance };
              })
              .filter(Boolean);
            return { ...crs, categories: filteredCategories };
          })
          .filter((crs: any) => (Array.isArray(crs.categories) ? crs.categories.length > 0 : true));
        updatedCollege.courses = filteredCourses;
      }

      // No course/category at this college clears the user's rank -> drop the whole college
      if (eligibleRanks.length === 0) return null;

      // Recompute the college-level summary strictly from the surviving eligible rows
      updatedCollege.closest_cutoff = Math.min(...eligibleRanks);
      updatedCollege.best_chance = eligibleChances.reduce(
        (best, cur) => (chanceRank[cur] > chanceRank[best] ? cur : best),
        eligibleChances[0]
      );

      return updatedCollege;
    })
    .filter(Boolean);

  return { ...aiData, [listKey]: sanitizedList };
}

// POST /api/ai-predict-colleges
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'counselling') {
      const { selectedColleges, examType, category, course } = body;
      if (!Array.isArray(selectedColleges) || selectedColleges.length === 0) {
        return NextResponse.json({ error: 'Please select at least one college for counselling prediction.' }, { status: 400 });
      }

      const examName = examType || 'NEET_UG';
      const promptText = counsellingPrompt(selectedColleges, examName, category || 'ALL', course || 'MBBS');

      let aiData;
      const usePerplexityFirst = AI_API_TO_USE === 'perplexity';

      try {
        if (usePerplexityFirst) {
          aiData = await callPerplexityForCounselling(promptText);
        } else {
          aiData = await callGeminiForCounselling(promptText);
        }
      } catch (primaryErr: any) {
        console.warn('Primary AI counselling predictor failed, attempting fallback...', primaryErr?.message);
        try {
          if (usePerplexityFirst) {
            aiData = await callGeminiForCounselling(promptText);
          } else if (process.env.PERPLEXITY_API_KEY) {
            aiData = await callPerplexityForCounselling(promptText);
          } else {
            throw primaryErr;
          }
        } catch {
          throw primaryErr;
        }
      }

      if (aiData && Array.isArray(aiData.colleges)) {
        aiData.colleges = aiData.colleges.map((col: any) => {
          const cleanName = sanitizeCollegeName(col.name);
          const normalizedType = normalizeCollegeType(col.collegeType);
          const correctedUrl = enforceVerifiedWebsite({
            state: col.state,
            collegeType: normalizedType,
            officialWebsite: col.officialWebsite
          });
          const auth = getAuthorityForState(col.state);
          return {
            ...col,
            name: cleanName,
            collegeType: normalizedType,
            officialWebsite: correctedUrl,
            authorityInfo: auth ? {
              authority: auth.authority,
              organization: auth.organization,
              ugPortal: auth.ugPortal,
              pgPortal: auth.pgPortal,
              officialWebsite: auth.officialWebsite,
              counsellingPortal: auth.counsellingPortal,
              notificationPage: auth.notificationPage,
              quotaType: auth.quotaType,
              notes: auth.notes
            } : null
          };
        });

        aiData = stripDuplicateGenericCounselling(aiData);
      }

      return NextResponse.json(aiData);
    }

    const { rank, states, category, courses, course, examType } = body;

    const rankNum = typeof rank === 'number' && rank > 0 ? rank : null;
    if (rankNum === null) {
      return NextResponse.json({ error: 'Please enter a valid rank score for AI prediction.' }, { status: 400 });
    }

    const selectedExamCode = examType || 'NEET_UG';
    const examMetadata = SUPPORTED_EXAMS.find(e => e.code === selectedExamCode) || SUPPORTED_EXAMS[0];
    const examName = examMetadata.name;

    // Handle course/courses selection
    const rawCourse = courses || course;
    let selectedCourseCodes: string[] = [];
    if (Array.isArray(rawCourse)) {
      selectedCourseCodes = rawCourse;
    } else if (typeof rawCourse === 'string' && rawCourse !== 'ALL' && rawCourse.trim() !== '') {
      selectedCourseCodes = [rawCourse];
    } else {
      const availableCourses = getCoursesByExam(selectedExamCode as any);
      selectedCourseCodes = availableCourses.map(c => c.code);
    }

    const targetCoursesList = selectedCourseCodes.map(code => {
      const match = ALL_COURSES.find(c => c.code === code);
      return match ? `${match.name} (${match.code})` : code;
    });
    const targetCoursesStr = targetCoursesList.length > 0 ? targetCoursesList.join(', ') : 'All Courses (MBBS, BDS, BAMS)';

    // Map state codes to state names
    const selectedStateCodes = Array.isArray(states) ? states : [];
    const preferredStatesList = selectedStateCodes.map(code => {
      const match = INDIAN_STATES.find(s => s.code === code);
      return match ? match.name : code;
    });
    const preferredStateStr = preferredStatesList.length > 0 ? preferredStatesList.join(', ') : 'All India Quota';

    // Map category code to category name
    const targetCategory = category && category !== 'ALL'
      ? (NEET_CATEGORIES.find(c => c.code === category)?.name || category)
      : 'General (UR)';

    // Direct static PG College Dataset matching for NEET PG (using General UR cutoffs dataset)
    const isKarnatakaOnly = selectedStateCodes.length === 1 && (selectedStateCodes[0] === 'KA' || selectedStateCodes[0] === 'Karnataka');
    const targetUgDataset = isKarnatakaOnly ? KARNATAKA_UG_COLLEGES : ALLSTATE_UG_COLLEGES;
    const targetPgDataset = isKarnatakaOnly ? KARNATAKA_PG_COLLEGES : ALLSTATE_PG_COLLEGES;

    if (selectedExamCode === 'NEET_PG') {
      const isGeneralOrAllCategory = !category || category === 'ALL' || category === 'UR';

      let pgMatches = (targetPgDataset as any[]).filter((col: any) => {
        if (
          selectedCourseCodes.length > 0 &&
          !selectedCourseCodes.includes('ALL') &&
          !selectedCourseCodes.includes('MD')
        ) {
          const matchSpecialty = selectedCourseCodes.some(
            (code) =>
              (col.specialtyCode && col.specialtyCode === code) ||
              (col.specialty && col.specialty.toLowerCase().includes(code.toLowerCase()))
          );
          if (!matchSpecialty) return false;
        }

        const closingRankNum = col.closingRank || col.closing_rank || 50000;
        if (rankNum <= 10) return true;
        return rankNum <= closingRankNum + 1500;
      });

      if (pgMatches.length > 0 && isGeneralOrAllCategory) {
        const formattedColleges = pgMatches.map((col: any) => {
          const closingRankNum = col.closingRank || col.closing_rank || 50000;
          const openingRankNum = col.openingRank || col.opening_rank || 1;
          const chance = rankNum <= 10 ? 'High' : computeChance(rankNum, closingRankNum);

          const auth = getAuthorityForState(col.state_name || col.state || 'Karnataka');

          return {
            college_id: col.college_id || col.id,
            name: col.college_name || col.collegeName,
            state: col.state_name || col.state || 'Karnataka',
            city: col.city_name || col.city || '',
            collegeType: col.college_type || col.collegeType || 'Government',
            officialWebsite: auth?.officialWebsite || 'https://kea.kar.nic.in/',
            best_chance: chance,
            closest_cutoff: closingRankNum,
            opening_cutoff: openingRankNum,
            cutoffs: [
              {
                course: col.specialty || 'MD / MS',
                category: targetCategory,
                openingRank: openingRankNum,
                closingRank: closingRankNum,
                chanceOfAdmission: chance
              }
            ],
            authorityInfo: auth ? {
              authority: auth.authority,
              organization: auth.organization,
              ugPortal: auth.ugPortal,
              pgPortal: auth.pgPortal,
              officialWebsite: auth.officialWebsite,
              registrationPortal: auth.registrationPortal,
              quotaType: auth.quotaType,
              notes: auth.notes
            } : null
          };
        });

        return NextResponse.json({ colleges: formattedColleges });
      }
    }

    // Direct static UG College Dataset matching for NEET UG (using General UR cutoffs dataset)
    if (selectedExamCode === 'NEET_UG') {
      const isGeneralOrAllCategory = !category || category === 'ALL' || category === 'UR';

      let ugMatches = (targetUgDataset as any[]).filter((col: any) => {
        if (
          selectedCourseCodes.length > 0 &&
          !selectedCourseCodes.includes('ALL')
        ) {
          const matchCourse = selectedCourseCodes.some(
            (code) =>
              (col.course && (col.course === code || col.course.toLowerCase().includes(code.toLowerCase()))) ||
              (col.courses && col.courses.some((c: any) => c.course_name?.toLowerCase().includes(code.toLowerCase())))
          );
          if (!matchCourse) return false;
        }

        const closingRankNum = col.closingRank || col.closing_rank || col.courses?.[0]?.categories?.[0]?.closing_rank || 150000;
        if (rankNum <= 1000) return true;
        return rankNum <= closingRankNum + 5000;
      });

      if (ugMatches.length > 0 && isGeneralOrAllCategory) {
        const formattedColleges = ugMatches.map((col: any) => {
          const closingRankNum = col.closingRank || col.closing_rank || col.courses?.[0]?.categories?.[0]?.closing_rank || 150000;
          const openingRankNum = col.openingRank || col.opening_rank || 1;
          const chance = rankNum <= 1000 ? 'High' : computeChance(rankNum, closingRankNum);

          const auth = getAuthorityForState(col.state_name || col.state || 'Karnataka');

          return {
            college_id: col.college_id || col.id,
            name: col.college_name || col.collegeName,
            state: col.state_name || col.state || 'Karnataka',
            city: col.city_name || col.city || '',
            collegeType: col.college_type || col.collegeType || 'Government',
            officialWebsite: auth?.officialWebsite || 'https://kea.kar.nic.in/',
            best_chance: chance,
            closest_cutoff: closingRankNum,
            opening_cutoff: openingRankNum,
            cutoffs: col.courses ? col.courses.map((crs: any) => ({
              course: crs.course_name,
              category: targetCategory,
              openingRank: openingRankNum,
              closingRank: crs.categories?.[0]?.closing_rank || closingRankNum,
              chanceOfAdmission: chance
            })) : [
              {
                course: col.course || 'MBBS',
                category: targetCategory,
                openingRank: openingRankNum,
                closingRank: closingRankNum,
                chanceOfAdmission: chance
              }
            ],
            authorityInfo: auth ? {
              authority: auth.authority,
              organization: auth.organization,
              ugPortal: auth.ugPortal,
              pgPortal: auth.pgPortal,
              officialWebsite: auth.officialWebsite,
              registrationPortal: auth.registrationPortal,
              quotaType: auth.quotaType,
              notes: auth.notes
            } : null
          };
        });

        return NextResponse.json({ colleges: formattedColleges });
      }
    }

    const usePerplexityFirst = AI_API_TO_USE === 'perplexity';

    const callPrimary = () =>
      usePerplexityFirst
        ? predictCollegesWithPerplexity(rankNum, examName, examMetadata, targetCategory, targetCoursesStr, preferredStateStr)
        : predictCollegesWithGemini(rankNum, examName, examMetadata, targetCategory, targetCoursesStr, preferredStateStr);

    const callFallback = () =>
      usePerplexityFirst
        ? predictCollegesWithGemini(rankNum, examName, examMetadata, targetCategory, targetCoursesStr, preferredStateStr)
        : predictCollegesWithPerplexity(rankNum, examName, examMetadata, targetCategory, targetCoursesStr, preferredStateStr);

    let aiData;

    try {
      aiData = await callPrimary();

      if (detectHallucinatedCutoffs(aiData, rankNum)) {
        console.warn('Detected hallucinated/echoed cutoffs from primary AI provider, retrying with fallback...');
        const fallbackHasKey = usePerplexityFirst ? !!process.env.GEMINI_API_KEY : !!process.env.PERPLEXITY_API_KEY;
        if (fallbackHasKey) {
          const fallbackData = await callFallback();
          if (!detectHallucinatedCutoffs(fallbackData, rankNum)) {
            aiData = fallbackData;
          }
        }
      }
    } catch (primaryErr: any) {
      console.warn('Primary AI college predictor failed, attempting fallback...', primaryErr?.message);
      try {
        const fallbackHasKey = usePerplexityFirst ? !!process.env.GEMINI_API_KEY : !!process.env.PERPLEXITY_API_KEY;
        if (fallbackHasKey) {
          aiData = await callFallback();
        } else {
          throw primaryErr;
        }
      } catch {
        throw primaryErr;
      }
    }

    // Deterministically correct/filter the AI's output using the actual rank
    // vs cutoff numbers (dropping echoed/hallucinated cutoffs — see
    // computeChance), instead of trusting whatever chance label it guessed.
    aiData = sanitizeCollegeData(aiData, rankNum);

    // Enforce the person's selected states for real — don't rely on the AI
    // having honored the state hint in its prompt.
    aiData = filterByStates(aiData, selectedStateCodes, preferredStatesList);

    // For extremely rare/top ranks (e.g. AIR 1–100) there is often no real
    // historical cutoff data at all, so after stripping echoed/invalid rows
    // the list can legitimately end up empty. Surface a clear, honest
    // message instead of returning an empty { colleges: [] } that renders as
    // a silent "Matching Colleges (0)" panel with no explanation.
    const finalList = aiData?.colleges || aiData?.results || [];
    if (!Array.isArray(finalList) || finalList.length === 0) {
      return NextResponse.json({
        colleges: [],
        notice:
          `We don't have reliable historical cutoff data to confidently match colleges for AIR ${rankNum} in the selected state(s)/course/category combination. ` +
          `This is common for extremely rare top ranks. Try a more typical rank range, widen your state selection, or contact our counselling experts for a manual review.`
      });
    }

    return NextResponse.json(aiData);
  } catch (error: any) {
    console.error('Predict Colleges AI Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}