// /**
//  * Verified Karnataka medical/dental college dataset for rank-based college
//  * prediction.
//  *
//  * IMPORTANT — DATA INTEGRITY RULE:
//  * `openingCutoff` / `closingCutoff` are intentionally `null` placeholders in
//  * this scaffold. They must be filled in ONLY from a real, official source
//  * (KEA round-wise seat allotment result — kea.kar.nic.in — or MCC for AIQ
//  * seats), never generated or estimated by an AI model. This file exists
//  * specifically to replace an earlier design where an AI model was asked to
//  * invent cutoff numbers on every request, which produced hallucinated /
//  * echoed values (e.g. a rank of 1 showing every college's cutoff as "1").
//  * Matching against this static, verified array removes that failure mode
//  * entirely — there is no generation step left to hallucinate.
//  */

// export type CollegeType = 'Government' | 'Private' | 'Deemed' | 'Government-Aided';

// export interface CategoryCutoff {
//   category: 'General (UR)' | 'OBC' | 'EWS' | 'SC' | 'ST';
//   openingCutoff: number | null;
//   closingCutoff: number | null;
// }

// export interface CourseCutoffs {
//   course: 'MBBS' | 'BDS';
//   categories: CategoryCutoff[];
// }

// export interface KarnatakaCollege {
//   collegeId: string;
//   collegeName: string;
//   city: string;
//   state: 'Karnataka';
//   collegeType: CollegeType;
//   /** True when the city above should be double-checked against an official source before use. */
//   cityVerifyNeeded?: boolean;
//   courses: CourseCutoffs[];
// }

// export const KARNATAKA_COLLEGES: KarnatakaCollege[] = [
//   {
//     collegeId: 'kar-001',
//     collegeName: 'Mysore Medical College and Research Institute',
//     city: 'Mysuru',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-002',
//     collegeName: 'Bangalore Medical College & Research Institute (BMCRI)',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-003',
//     collegeName: 'Karnataka Institute of Medical Sciences, Hubli (KIMS)',
//     city: 'Hubballi',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-004',
//     collegeName: 'Vijayanagar Institute of Medical Sciences, Bellary (VIMS)',
//     city: 'Ballari',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-005',
//     collegeName: 'Belagavi Institute of Medical Sciences (BIMS)',
//     city: 'Belagavi',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-006',
//     collegeName: 'Hassan Institute of Medical Sciences (HIMS)',
//     city: 'Hassan',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-007',
//     collegeName: 'Mandya Institute of Medical Sciences (MIMS)',
//     city: 'Mandya',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-008',
//     collegeName: 'Bidar Institute of Medical Sciences (BRIMS)',
//     city: 'Bidar',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-009',
//     collegeName: 'Raichur Institute of Medical Sciences (RIMS)',
//     city: 'Raichur',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-010',
//     collegeName: 'Shimoga Institute of Medical Sciences (SIMS)',
//     city: 'Shivamogga',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-011',
//     collegeName: 'Gadag Institute of Medical Sciences (GIMS)',
//     city: 'Gadag',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-012',
//     collegeName: 'Gulbarga Institute of Medical Sciences',
//     city: 'Kalaburagi',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-013',
//     collegeName: 'Koppal Institute of Medical Sciences (KOIMS)',
//     city: 'Koppal',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-014',
//     collegeName: 'Chamarajanagar Institute of Medical Sciences (CIMS)',
//     city: 'Chamarajanagar',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-015',
//     collegeName: 'Kodagu Institute of Medical Sciences (KoIMS)',
//     city: 'Madikeri',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-016',
//     collegeName: 'Karwar Institute of Medical Sciences (KRIMS)',
//     city: 'Karwar',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-017',
//     collegeName: 'Bowring & Lady Curzon Medical College',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-018',
//     collegeName: 'Chikkaballapura Institute of Medical Sciences (CBIMS)',
//     city: 'Chikkaballapur',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-019',
//     collegeName: 'Chitradurga Medical College',
//     city: 'Chitradurga',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-020',
//     collegeName: 'Yadgiri Institute of Medical Sciences (YIMS)',
//     city: 'Yadgir',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-021',
//     collegeName: 'Haveri Institute of Medical Sciences (HalMS)',
//     city: 'Haveri',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-022',
//     collegeName: 'Chikkamagaluru Institute of Medical Sciences',
//     city: 'Chikkamagaluru',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-023',
//     collegeName: 'ESIC & PGIMSR Bangalore',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Government-Aided',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-024',
//     collegeName: 'ESIC Medical College Gulbarga',
//     city: 'Kalaburagi',
//     state: 'Karnataka',
//     collegeType: 'Government-Aided',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-025',
//     collegeName: 'Mahadevappa Rampure Medical College',
//     city: 'Kalaburagi',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-026',
//     collegeName: 'JJM Medical College',
//     city: 'Davangere',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-027',
//     collegeName: 'Dr B R Ambedkar Medical College',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-028',
//     collegeName: 'Kempegowda Institute of Medical Sciences (KIMS Bangalore)',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-029',
//     collegeName: 'Sri Basaveshwara Medical College',
//     city: 'Chitradurga',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-030',
//     collegeName: 'K V G Medical College, Sullia',
//     city: 'Sullia',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-031',
//     collegeName: 'Nijalingappa Medical College',
//     city: 'Bagalkot',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-032',
//     collegeName: 'S S Institute of Medical Sciences (SSIMS)',
//     city: 'Davangere',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-033',
//     collegeName: 'BGS Global Institute of Medical Sciences',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-034',
//     collegeName: 'Shridevi Institute of Medical Sciences, Tumkur',
//     city: 'Tumakuru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-035',
//     collegeName: 'East Point College of Medical Sciences',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-036',
//     collegeName: 'Siddaganga Medical College & Research Institute',
//     city: 'Tumakuru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-037',
//     collegeName: 'S R Patil Medical College',
//     city: 'Bagalkot',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     cityVerifyNeeded: true,
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-038',
//     collegeName: 'Farookh Academy of Medical Education',
//     city: 'Nelamangala',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     cityVerifyNeeded: true,
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-039',
//     collegeName: 'St John\'s Medical College',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-040',
//     collegeName: 'Al-Ameen Medical College',
//     city: 'Vijayapura',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-041',
//     collegeName: 'M V J Medical College',
//     city: 'Hoskote',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-042',
//     collegeName: 'Father Muller Institute of Medical Education',
//     city: 'Mangaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-043',
//     collegeName: 'Navodaya Medical College',
//     city: 'Raichur',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-044',
//     collegeName: 'A J Institute of Medical Sciences',
//     city: 'Mangaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-045',
//     collegeName: 'Vydehi Institute of Medical Sciences',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-046',
//     collegeName: 'Subbaiah Institute of Medical Sciences',
//     city: 'Shivamogga',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-047',
//     collegeName: 'The Oxford Medical College',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-048',
//     collegeName: 'Akash Institute of Medical Sciences',
//     city: 'Devanahalli',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     cityVerifyNeeded: true,
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-049',
//     collegeName: 'Kanachur Institute of Medical Sciences',
//     city: 'Mangaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-050',
//     collegeName: 'Sri Chamundeshwari Medical College',
//     city: 'Channapatna',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     cityVerifyNeeded: true,
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-051',
//     collegeName: 'M S Ramaiah Medical College',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-052',
//     collegeName: 'Adichunchanagiri Institute of Medical Sciences',
//     city: 'B G Nagar, Mandya',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-053',
//     collegeName: 'SDM College of Medical Sciences & Hospital',
//     city: 'Dharwad',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-054',
//     collegeName: 'Sapthagiri Institute of Medical Sciences',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-055',
//     collegeName: 'Srinivas Institute of Medical Sciences',
//     city: 'Mangaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-056',
//     collegeName: 'Dr Chandramma Dayananda Sagar IMER',
//     city: 'Harohalli',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     cityVerifyNeeded: true,
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-057',
//     collegeName: 'Sri Madhusudan Sai Institute of Medical Sciences',
//     city: 'Chikkaballapur',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     cityVerifyNeeded: true,
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-058',
//     collegeName: 'PES Institute of Medical Sciences, Bangalore',
//     city: 'Kuppam',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     cityVerifyNeeded: true,
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-059',
//     collegeName: 'BGS Medical College',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-060',
//     collegeName: 'Khaja Bande Nawaz Institute of Medical Sciences (KBNIMS)',
//     city: 'Kalaburagi',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-061',
//     collegeName: 'Kasturba Medical College, Manipal',
//     city: 'Manipal',
//     state: 'Karnataka',
//     collegeType: 'Deemed',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-062',
//     collegeName: 'Kasturba Medical College, Mangalore',
//     city: 'Mangaluru',
//     state: 'Karnataka',
//     collegeType: 'Deemed',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-063',
//     collegeName: 'Jawaharlal Nehru Medical College, Belagavi',
//     city: 'Belagavi',
//     state: 'Karnataka',
//     collegeType: 'Deemed',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-064',
//     collegeName: 'JSS Medical College, Mysore',
//     city: 'Mysuru',
//     state: 'Karnataka',
//     collegeType: 'Deemed',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-065',
//     collegeName: 'Shri B M Patil Medical College',
//     city: 'Vijayapura',
//     state: 'Karnataka',
//     collegeType: 'Deemed',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-066',
//     collegeName: 'Sri Devaraj Urs Medical College (SDUMC)',
//     city: 'Kolar',
//     state: 'Karnataka',
//     collegeType: 'Deemed',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-067',
//     collegeName: 'Sri Siddhartha Medical College, Tumkur',
//     city: 'Tumakuru',
//     state: 'Karnataka',
//     collegeType: 'Deemed',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-068',
//     collegeName: 'K S Hegde Medical Academy',
//     city: 'Mangaluru',
//     state: 'Karnataka',
//     collegeType: 'Deemed',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-069',
//     collegeName: 'Rajarajeswari Medical College & Hospital',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Private',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-070',
//     collegeName: 'Sri Siddhartha Institute of Medical Sciences, Bangalore',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     collegeType: 'Deemed',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-071',
//     collegeName: 'Jagadguru Gangadhar M M Medical College',
//     city: 'Kalaburagi',
//     state: 'Karnataka',
//     collegeType: 'Government',
//     cityVerifyNeeded: true,
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
//   {
//     collegeId: 'kar-072',
//     collegeName: 'Yenepoya Medical College',
//     city: 'Mangaluru',
//     state: 'Karnataka',
//     collegeType: 'Deemed',
//     courses: [
//       {
//         course: 'MBBS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       },
//       {
//         course: 'BDS',
//         categories: [
//           { category: 'General (UR)', openingCutoff: null, closingCutoff: null },
//           { category: 'OBC', openingCutoff: null, closingCutoff: null },
//           { category: 'EWS', openingCutoff: null, closingCutoff: null },
//           { category: 'SC', openingCutoff: null, closingCutoff: null },
//           { category: 'ST', openingCutoff: null, closingCutoff: null }
//         ]
//       }
//     ]
//   },
// ];

// /**
//  * Looks up a college by its collegeId. Fuzzy fallback on name substring
//  * match, mirroring the tolerant lookup style used by getAuthorityForState.
//  */
// export function getCollegeById(id: string): KarnatakaCollege | null {
//   if (!id) return null;
//   return KARNATAKA_COLLEGES.find((c) => c.collegeId === id) || null;
// }

// export function findCollegeByName(rawName: string): KarnatakaCollege | null {
//   if (!rawName) return null;
//   const normalized = rawName.toLowerCase().trim();
//   return (
//     KARNATAKA_COLLEGES.find((c) => c.collegeName.toLowerCase() === normalized) ||
//     KARNATAKA_COLLEGES.find(
//       (c) =>
//         c.collegeName.toLowerCase().includes(normalized) ||
//         normalized.includes(c.collegeName.toLowerCase())
//     ) ||
//     null
//   );
// }

// export interface CollegeMatch {
//   collegeId: string;
//   collegeName: string;
//   city: string;
//   collegeType: CollegeType;
//   course: string;
//   category: string;
//   openingCutoff: number;
//   closingCutoff: number;
//   chance: 'High' | 'Medium' | 'Low';
// }

// /**
//  * Deterministic, non-AI rank matcher. Eligibility is decided purely by
//  * `studentRank <= closingCutoff` — `openingCutoff` is informational only
//  * (it shows how competitive that seat is) and is NEVER used to disqualify
//  * a student, since a better-than-opening rank is still eligible.
//  *
//  * Rows with a null cutoff (not yet filled with verified data) are skipped,
//  * never treated as "0" or matched against.
//  */
// export function matchKarnatakaColleges(
//   studentRank: number,
//   opts: { course?: 'MBBS' | 'BDS' | 'ALL'; category?: string; } = {}
// ): CollegeMatch[] {
//   const wantCourse = (opts.course || 'ALL').toUpperCase();
//   const wantCategory = (opts.category || 'ALL').toUpperCase();

//   const results: CollegeMatch[] = [];

//   for (const college of KARNATAKA_COLLEGES) {
//     for (const courseEntry of college.courses) {
//       if (wantCourse !== 'ALL' && courseEntry.course.toUpperCase() !== wantCourse) continue;

//       for (const cat of courseEntry.categories) {
//         if (wantCategory !== 'ALL' && cat.category.toUpperCase() !== wantCategory) continue;
//         if (cat.closingCutoff === null || cat.openingCutoff === null) continue; // no verified data yet
//         if (studentRank > cat.closingCutoff) continue; // not eligible

//         const margin = (cat.closingCutoff - studentRank) / cat.closingCutoff;
//         const chance: CollegeMatch['chance'] = margin >= 0.3 ? 'High' : margin >= 0.1 ? 'Medium' : 'Low';

//         results.push({
//           collegeId: college.collegeId,
//           collegeName: college.collegeName,
//           city: college.city,
//           collegeType: college.collegeType,
//           course: courseEntry.course,
//           category: cat.category,
//           openingCutoff: cat.openingCutoff,
//           closingCutoff: cat.closingCutoff,
//           chance,
//         });
//       }
//     }
//   }

//   return results.sort((a, b) => a.closingCutoff - b.closingCutoff);
// }



export type UGCollegeType = 'Government' | 'Private' | 'Deemed';

export interface KarnatakaUGCollegeCutoff {
  id: string;
  collegeName: string;
  course: 'MBBS';
  city: string;
  state: 'Karnataka';
  collegeType: UGCollegeType;
  openingRank: number;
  closingRank: number;
  category: 'General (UR)' | string;
}

export const KARNATAKA_UG_COLLEGES: KarnatakaUGCollegeCutoff[] = [
  // Government Medical Colleges
  {
    id: 'ug-kar-001',
    collegeName: 'Mysore Medical College',
    course: 'MBBS',
    city: 'Mysore',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 1200,
    closingRank: 4500,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-002',
    collegeName: 'Bangalore Medical College & Research Institute (BMCRI)',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 150,
    closingRank: 1800,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-003',
    collegeName: 'Karnataka Institute of Medical Sciences, Hubli (KIMS)',
    course: 'MBBS',
    city: 'Hubli',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 2500,
    closingRank: 8200,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-004',
    collegeName: 'Vijayanagar Institute of Medical Sciences, Bellary (VIMS)',
    course: 'MBBS',
    city: 'Bellary',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 3500,
    closingRank: 11500,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-005',
    collegeName: 'Belagavi Institute of Medical Sciences (BIMS)',
    course: 'MBBS',
    city: 'Belagavi',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 4200,
    closingRank: 13200,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-006',
    collegeName: 'Hassan Institute of Medical Sciences (HIMS)',
    course: 'MBBS',
    city: 'Hassan',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 4800,
    closingRank: 14500,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-007',
    collegeName: 'Mandya Institute of Medical Sciences (MIMS)',
    course: 'MBBS',
    city: 'Mandya',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 4000,
    closingRank: 12800,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-008',
    collegeName: 'Bidar Institute of Medical Sciences (BRIMS)',
    course: 'MBBS',
    city: 'Bidar',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 7000,
    closingRank: 18500,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-009',
    collegeName: 'Raichur Institute of Medical Sciences (RIMS)',
    course: 'MBBS',
    city: 'Raichur',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 7500,
    closingRank: 19200,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-010',
    collegeName: 'Shimoga Institute of Medical Sciences (SIMS)',
    course: 'MBBS',
    city: 'Shimoga',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 5500,
    closingRank: 15800,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-011',
    collegeName: 'Gadag Institute of Medical Sciences (GIMS)',
    course: 'MBBS',
    city: 'Gadag',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 8200,
    closingRank: 20400,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-012',
    collegeName: 'Gulbarga Institute of Medical Sciences',
    course: 'MBBS',
    city: 'Gulbarga',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 6800,
    closingRank: 17900,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-013',
    collegeName: 'Koppal Institute of Medical Sciences (KOIMS)',
    course: 'MBBS',
    city: 'Koppal',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 9100,
    closingRank: 21800,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-014',
    collegeName: 'Chamarajanagar Institute of Medical Sciences (CIMS)',
    course: 'MBBS',
    city: 'Chamarajanagar',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 9500,
    closingRank: 22500,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-015',
    collegeName: 'Kodagu Institute of Medical Sciences (KoIMS)',
    course: 'MBBS',
    city: 'Madikeri',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 9200,
    closingRank: 22100,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-016',
    collegeName: 'Karwar Institute of Medical Sciences (KRIMS)',
    course: 'MBBS',
    city: 'Karwar',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 9000,
    closingRank: 21500,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-017',
    collegeName: 'Bowring & Lady Curzon Medical College',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 1100,
    closingRank: 5200,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-018',
    collegeName: 'Chikkaballapura Institute of Medical Sciences (CBIMS)',
    course: 'MBBS',
    city: 'Chikkaballapura',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 10200,
    closingRank: 23400,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-019',
    collegeName: 'Chitradurga Medical College',
    course: 'MBBS',
    city: 'Chitradurga',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 10800,
    closingRank: 24200,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-020',
    collegeName: 'Yadgir Institute of Medical Sciences (YIMS)',
    course: 'MBBS',
    city: 'Yadgir',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 11500,
    closingRank: 25100,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-021',
    collegeName: 'Haveri Institute of Medical Sciences (HaIMS)',
    course: 'MBBS',
    city: 'Haveri',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 11000,
    closingRank: 24500,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-022',
    collegeName: 'Chikkamagaluru Institute of Medical Sciences',
    course: 'MBBS',
    city: 'Chikkamagaluru',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 10700,
    closingRank: 23900,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-023',
    collegeName: 'ESIC & PGIMSR Bangalore',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 3800,
    closingRank: 14200,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-024',
    collegeName: 'ESIC Medical College Gulbarga',
    course: 'MBBS',
    city: 'Gulbarga',
    state: 'Karnataka',
    collegeType: 'Government',
    openingRank: 9800,
    closingRank: 23100,
    category: 'General (UR)'
  },

  // Private & Trust Medical Colleges
  {
    id: 'ug-kar-025',
    collegeName: 'Mahadevappa Rampure Medical College',
    course: 'MBBS',
    city: 'Kalaburagi',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 25000,
    closingRank: 75000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-026',
    collegeName: 'JJM Medical College',
    course: 'MBBS',
    city: 'Davanagere',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 18000,
    closingRank: 52000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-027',
    collegeName: 'Dr B R Ambedkar Medical College',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 22000,
    closingRank: 64000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-028',
    collegeName: 'Kempegowda Institute of Medical Sciences (KIMS Bangalore)',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 11000,
    closingRank: 32000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-029',
    collegeName: 'Sri Basaveshwara Medical College',
    course: 'MBBS',
    city: 'Chitradurga',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 29000,
    closingRank: 85000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-030',
    collegeName: 'K V G Medical College, Sullia',
    course: 'MBBS',
    city: 'Sullia',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 31000,
    closingRank: 89000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-031',
    collegeName: 'Nijalingappa Medical College',
    course: 'MBBS',
    city: 'Bagalkot',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 20000,
    closingRank: 58000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-032',
    collegeName: 'S S Institute of Medical Sciences (SSIMS)',
    course: 'MBBS',
    city: 'Davanagere',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 16500,
    closingRank: 48000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-033',
    collegeName: 'BGS Global Institute of Medical Sciences',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 13000,
    closingRank: 38000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-034',
    collegeName: 'Shridevi Institute of Medical Sciences, Tumkur',
    course: 'MBBS',
    city: 'Tumkur',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 33000,
    closingRank: 95000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-035',
    collegeName: 'East Point College of Medical Sciences',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 34000,
    closingRank: 98000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-036',
    collegeName: 'Siddaganga Medical College & Research Institute',
    course: 'MBBS',
    city: 'Tumkur',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 19000,
    closingRank: 55000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-037',
    collegeName: 'S R Patil Medical College',
    course: 'MBBS',
    city: 'Badami',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 36000,
    closingRank: 105000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-038',
    collegeName: 'Farookh Academy of Medical Education',
    course: 'MBBS',
    city: 'Mangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 35000,
    closingRank: 102000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-039',
    collegeName: "St John's Medical College",
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 800,
    closingRank: 3500,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-040',
    collegeName: 'Al-Ameen Medical College',
    course: 'MBBS',
    city: 'Bijapur',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 28000,
    closingRank: 82000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-041',
    collegeName: 'M V J Medical College',
    course: 'MBBS',
    city: 'Hoskote',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 21000,
    closingRank: 61000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-042',
    collegeName: 'Father Muller Institute of Medical Education',
    course: 'MBBS',
    city: 'Mangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 6500,
    closingRank: 19500,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-043',
    collegeName: 'Navodaya Medical College',
    course: 'MBBS',
    city: 'Raichur',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 26000,
    closingRank: 78000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-044',
    collegeName: 'A J Institute of Medical Sciences',
    course: 'MBBS',
    city: 'Mangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 15000,
    closingRank: 44000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-045',
    collegeName: 'Vydehi Institute of Medical Sciences',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 12000,
    closingRank: 35000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-046',
    collegeName: 'Subbaiah Institute of Medical Sciences',
    course: 'MBBS',
    city: 'Shimoga',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 32000,
    closingRank: 92000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-047',
    collegeName: 'The Oxford Medical College',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 30000,
    closingRank: 88000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-048',
    collegeName: 'Akash Institute of Medical Sciences',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 24000,
    closingRank: 70000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-049',
    collegeName: 'Kanachur Institute of Medical Sciences',
    course: 'MBBS',
    city: 'Mangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 27000,
    closingRank: 79000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-050',
    collegeName: 'Sri Chamundeshwari Medical College',
    course: 'MBBS',
    city: 'Channapatna',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 29000,
    closingRank: 84000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-051',
    collegeName: 'M S Ramaiah Medical College',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 2500,
    closingRank: 9800,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-052',
    collegeName: 'Adichunchanagiri Institute of Medical Sciences',
    course: 'MBBS',
    city: 'Bellur',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 21000,
    closingRank: 62000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-053',
    collegeName: 'SDM College of Medical Sciences & Hospital',
    course: 'MBBS',
    city: 'Dharwad',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 10500,
    closingRank: 31000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-054',
    collegeName: 'Sapthagiri Institute of Medical Sciences',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 16000,
    closingRank: 47000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-055',
    collegeName: 'Srinivas Institute of Medical Sciences',
    course: 'MBBS',
    city: 'Mangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 23000,
    closingRank: 67000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-056',
    collegeName: 'Dr Chandramma Dayananda Sagar IMER',
    course: 'MBBS',
    city: 'Ramanagara',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 19500,
    closingRank: 57000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-057',
    collegeName: 'Sri Madhusudan Sai Institute of Medical Sciences',
    course: 'MBBS',
    city: 'Chikkaballapur',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 22000,
    closingRank: 65000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-058',
    collegeName: 'PES Institute of Medical Sciences, Bangalore',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 17000,
    closingRank: 49000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-059',
    collegeName: 'BGS Medical College',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 14000,
    closingRank: 41000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-060',
    collegeName: 'Khaja Bande Navaz Institute of Medical Sciences (KBNIMS)',
    course: 'MBBS',
    city: 'Gulbarga',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 31000,
    closingRank: 90000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-061',
    collegeName: 'Jagadguru Gangadhar M M Medical College',
    course: 'MBBS',
    city: 'Hubli',
    state: 'Karnataka',
    collegeType: 'Private',
    openingRank: 24000,
    closingRank: 71000,
    category: 'General (UR)'
  },

  // Deemed Universities
  {
    id: 'ug-kar-062',
    collegeName: 'Kasturba Medical College, Manipal',
    course: 'MBBS',
    city: 'Manipal',
    state: 'Karnataka',
    collegeType: 'Deemed',
    openingRank: 2000,
    closingRank: 32000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-063',
    collegeName: 'Kasturba Medical College, Mangalore',
    course: 'MBBS',
    city: 'Mangalore',
    state: 'Karnataka',
    collegeType: 'Deemed',
    openingRank: 3500,
    closingRank: 38000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-064',
    collegeName: 'Jawaharlal Nehru Medical College, Belagavi',
    course: 'MBBS',
    city: 'Belagavi',
    state: 'Karnataka',
    collegeType: 'Deemed',
    openingRank: 6000,
    closingRank: 55000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-065',
    collegeName: 'JSS Medical College, Mysore',
    course: 'MBBS',
    city: 'Mysore',
    state: 'Karnataka',
    collegeType: 'Deemed',
    openingRank: 5000,
    closingRank: 45000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-066',
    collegeName: 'Shri B M Patil Medical College',
    course: 'MBBS',
    city: 'Vijayapura',
    state: 'Karnataka',
    collegeType: 'Deemed',
    openingRank: 18000,
    closingRank: 88000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-067',
    collegeName: 'Sri Devaraj Urs Medical College (SDUMC)',
    course: 'MBBS',
    city: 'Kolar',
    state: 'Karnataka',
    collegeType: 'Deemed',
    openingRank: 15000,
    closingRank: 75000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-068',
    collegeName: 'Sri Siddhartha Medical College, Tumkur',
    course: 'MBBS',
    city: 'Tumkur',
    state: 'Karnataka',
    collegeType: 'Deemed',
    openingRank: 21000,
    closingRank: 92000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-069',
    collegeName: 'K S Hegde Medical Academy',
    course: 'MBBS',
    city: 'Mangalore',
    state: 'Karnataka',
    collegeType: 'Deemed',
    openingRank: 9000,
    closingRank: 62000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-070',
    collegeName: 'Rajarajeswari Medical College & Hospital',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Deemed',
    openingRank: 14000,
    closingRank: 70000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-071',
    collegeName: 'Sri Siddhartha Institute of Medical Sciences, Bangalore',
    course: 'MBBS',
    city: 'Bangalore',
    state: 'Karnataka',
    collegeType: 'Deemed',
    openingRank: 22000,
    closingRank: 95000,
    category: 'General (UR)'
  },
  {
    id: 'ug-kar-072',
    collegeName: 'Yenepoya Medical College',
    course: 'MBBS',
    city: 'Mangalore',
    state: 'Karnataka',
    collegeType: 'Deemed',
    openingRank: 12000,
    closingRank: 68000,
    category: 'General (UR)'
  }
];

/**
 * Searches static Karnataka UG colleges (MBBS) by rank using predictive cutoffs.
 */
export function getMatchingKarnatakaUGColleges(
  rank: number
): KarnatakaUGCollegeCutoff[] {
  return KARNATAKA_UG_COLLEGES.filter((college) => {
    return rank <= college.closingRank + 2000;
  });
}