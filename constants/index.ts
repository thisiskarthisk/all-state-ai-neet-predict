export type ExamTypeCode = 'NEET_UG' | 'NEET_PG' | 'NEET_MDS';

export interface ExamMetadata {
  code: ExamTypeCode;
  name: string;
  fullName: string;
  description: string;
}

export interface Course {
  code: string;
  name: string;
  examCode: ExamTypeCode;
  duration: string;
  description: string;
}

export interface State {
  code: string;
  name: string;
  isUnionTerritory: boolean;
}

export interface Category {
  code: string;
  name: string;
  description?: string;
}

export interface RankLevel {
  minRank: number;
  maxRank: number;
  confidence: string;
}



export const SUPPORTED_EXAMS: ExamMetadata[] = [
  {
    code: 'NEET_UG',
    name: 'NEET UG',
    fullName: 'National Eligibility cum Entrance Test for Undergraduate Courses',
    description: 'Entrance for MBBS, BDS, BAMS, BHMS, and other allied undergraduate medical degrees.'
  },
  {
    code: 'NEET_PG',
    name: 'NEET PG',
    fullName: 'National Eligibility cum Entrance Test for Postgraduate Courses',
    description: 'Entrance for Doctor of Medicine (MD), Master of Surgery (MS), and PG Diploma medical specialties.'
  },
  // {
  //   code: 'NEET_MDS',
  //   name: 'NEET MDS',
  //   fullName: 'National Eligibility cum Entrance Test for Master of Dental Surgery',
  //   description: 'Entrance for postgraduate Master of Dental Surgery (MDS) dental specializations.'
  // }
];

export const NEET_UG_COURSES: Course[] = [
  {
    code: 'MBBS',
    name: 'MBBS',
    examCode: 'NEET_UG',
    duration: '5.5 Years (including 1 Year Internship)',
    description: 'Primary medical qualification to practice modern medicine and surgery.'
  },
  // {
  //   code: 'BDS',
  //   name: '(BDS) - Bachelor of Dental Surgery',
  //   examCode: 'NEET_UG',
  //   duration: '5 Years (including 1 Year Internship)',
  //   description: 'Professional medical course specializing in dental and oral health sciences.'
  // }
];

export const NEET_PG_COURSES: Course[] = [
  {
    code: 'MD',
    name: 'MD',
    examCode: 'NEET_PG',
    duration: '3 Years',
    description: 'Postgraduate specialization focused on internal medicine and clinical specialties.'
  },
  // {
  //   code: 'MD_GEN_MED',
  //   name: 'MD General Medicine',
  //   examCode: 'NEET_PG',
  //   duration: '3 Years',
  //   description: 'Postgraduate specialization focused on the diagnosis and non-surgical treatment of internal diseases.'
  // },
  // {
  //   code: 'MD_PAED',
  //   name: 'MD Paediatrics',
  //   examCode: 'NEET_PG',
  //   duration: '3 Years',
  //   description: 'Specialization focusing on medical care of infants, children, and adolescents.'
  // },
  // {
  //   code: 'MD_RADIO',
  //   name: 'MD Radiodiagnosis',
  //   examCode: 'NEET_PG',
  //   duration: '3 Years',
  //   description: 'Postgraduate specialization using imaging techniques to diagnose and monitor medical conditions.'
  // },
  // {
  //   code: 'MD_DERM',
  //   name: 'MD Dermatology, Venereology and Leprosy',
  //   examCode: 'NEET_PG',
  //   duration: '3 Years',
  //   description: 'Specialized clinical program focused on treatment of skin diseases and venereal infections.'
  // },
  // {
  //   code: 'MD_ANAES',
  //   name: 'MD Anaesthesiology',
  //   examCode: 'NEET_PG',
  //   duration: '3 Years',
  //   description: 'Postgraduate medical program in anesthesia and critical care operations.'
  // }
];

export const NEET_MDS_COURSES: Course[] = [
  {
    code: 'MDS_CONS_END',
    name: 'MDS Conservative Dentistry and Endodontics',
    examCode: 'NEET_MDS',
    duration: '3 Years',
    description: 'Postgraduate dental study focused on root canal treatments and preserving natural dentition.'
  },
  {
    code: 'MDS_ORAL_PATH',
    name: 'MDS Oral and Maxillofacial Pathology and Oral Microbiology',
    examCode: 'NEET_MDS',
    duration: '3 Years',
    description: 'Postgraduate dentistry dealing with diagnosis and microscopic analysis of oral cavity diseases.'
  },
  {
    code: 'MDS_ORAL_SURG',
    name: 'MDS Oral and Maxillofacial Surgery',
    examCode: 'NEET_MDS',
    duration: '3 Years',
    description: 'Surgical discipline specializing in treating defects, injuries, and aesthetic aspects of head and jaws.'
  },
  {
    code: 'MDS_ORAL_MED',
    name: 'MDS Oral Medicine and Radiology',
    examCode: 'NEET_MDS',
    duration: '3 Years',
    description: 'Specialty centering on medical diagnostics of systemic diseases showing manifestations in oral regions.'
  },
  {
    code: 'MDS_ORTHO',
    name: 'MDS Orthodontics and Dentofacial Orthopaedics',
    examCode: 'NEET_MDS',
    duration: '3 Years',
    description: 'Postgraduate dental science treating dental and facial irregularities (braces, alignment systems).'
  },
  {
    code: 'MDS_PEDO',
    name: 'MDS Pediatric and Preventive Dentistry',
    examCode: 'NEET_MDS',
    duration: '3 Years',
    description: 'Postgraduate Dental program focusing exclusively on therapeutic dental care for children.'
  },
  {
    code: 'MDS_PERIO',
    name: 'MDS Periodontology',
    examCode: 'NEET_MDS',
    duration: '3 Years',
    description: 'Dental specialization dealing with health, structure, and diseases of supporting teeth tissues.'
  },
  {
    code: 'MDS_PROSTHO',
    name: 'MDS Prosthodontics and Crown and Bridge',
    examCode: 'NEET_MDS',
    duration: '3 Years',
    description: 'Postgraduate dentistry handling oral rehabilitation, implants, artificial dentures, and crowns.'
  }
];

// Consolidate all courses into one master list
export const ALL_COURSES: Course[] = [
  ...NEET_UG_COURSES,
  ...NEET_PG_COURSES,
  ...NEET_MDS_COURSES
];

export const INDIAN_STATES: State[] = [
  { code: 'KA', name: 'Karnataka', isUnionTerritory: false },
  { code: 'AI', name: 'All India', isUnionTerritory: false },
  { code: 'AP', name: 'Andhra Pradesh', isUnionTerritory: false },
  { code: 'AR', name: 'Arunachal Pradesh', isUnionTerritory: false },
  { code: 'AS', name: 'Assam', isUnionTerritory: false },
  { code: 'BR', name: 'Bihar', isUnionTerritory: false },
  { code: 'CG', name: 'Chhattisgarh', isUnionTerritory: false },
  { code: 'GA', name: 'Goa', isUnionTerritory: false },
  { code: 'GJ', name: 'Gujarat', isUnionTerritory: false },
  { code: 'HR', name: 'Haryana', isUnionTerritory: false },
  { code: 'HP', name: 'Himachal Pradesh', isUnionTerritory: false },
  { code: 'JH', name: 'Jharkhand', isUnionTerritory: false },
  { code: 'KL', name: 'Kerala', isUnionTerritory: false },
  { code: 'MP', name: 'Madhya Pradesh', isUnionTerritory: false },
  { code: 'MH', name: 'Maharashtra', isUnionTerritory: false },
  { code: 'MN', name: 'Manipur', isUnionTerritory: false },
  { code: 'ML', name: 'Meghalaya', isUnionTerritory: false },
  { code: 'MZ', name: 'Mizoram', isUnionTerritory: false },
  { code: 'NL', name: 'Nagaland', isUnionTerritory: false },
  { code: 'OD', name: 'Odisha', isUnionTerritory: false },
  { code: 'PB', name: 'Punjab', isUnionTerritory: false },
  { code: 'RJ', name: 'Rajasthan', isUnionTerritory: false },
  { code: 'SK', name: 'Sikkim', isUnionTerritory: false },
  { code: 'TN', name: 'Tamil Nadu', isUnionTerritory: false },
  { code: 'TG', name: 'Telangana', isUnionTerritory: false },
  { code: 'TR', name: 'Tripura', isUnionTerritory: false },
  { code: 'UP', name: 'Uttar Pradesh', isUnionTerritory: false },
  { code: 'UK', name: 'Uttarakhand', isUnionTerritory: false },
  { code: 'WB', name: 'West Bengal', isUnionTerritory: false },
  // Union Territories
  { code: 'AN', name: 'Andaman and Nicobar Islands', isUnionTerritory: true },
  { code: 'CH', name: 'Chandigarh', isUnionTerritory: true },
  { code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu', isUnionTerritory: true },
  { code: 'DL', name: 'Delhi NCR', isUnionTerritory: true },
  { code: 'JK', name: 'Jammu and Kashmir', isUnionTerritory: true },
  { code: 'LA', name: 'Ladakh', isUnionTerritory: true },
  { code: 'LD', name: 'Lakshadweep', isUnionTerritory: true },
  { code: 'PY', name: 'Puducherry', isUnionTerritory: true }
];

export const NEET_CATEGORIES: Category[] = [
  { code: 'UR', name: 'General', description: 'Open Category without specific community reservations.' },
  { code: 'OBC', name:'OBC', description: 'OBC Non-Creamy Layer recognized in the Central Reservation List.' },
  { code: 'SC', name: 'SC', description: 'Candidates belonging to Scheduled Castes.' },
  { code: 'ST', name: 'ST', description: 'Candidates belonging to Scheduled Tribes.' },
  { code: 'EWS', name: 'EWS', description: 'General category candidates meeting EWS income parameters.' }
];

export const NEET_UG_RANK_LEVELS: RankLevel[] = [
  { minRank: 1, maxRank: 1000, confidence: "Very High" },
  { minRank: 1001, maxRank: 5000, confidence: "High" },
  { minRank: 5001, maxRank: 25000, confidence: "Medium" },
  { minRank: 25001, maxRank: 50000, confidence: "Low" },
  { minRank: 50001, maxRank: Number.MAX_SAFE_INTEGER, confidence: "Very Low" },
];

export const NEET_PG_RANK_LEVELS: RankLevel[] = [
  { minRank: 1, maxRank: 500, confidence: "Very High" },
  { minRank: 501, maxRank: 2000, confidence: "High" },
  { minRank: 2001, maxRank: 10000, confidence: "Medium" },
  { minRank: 10001, maxRank: 25000, confidence: "Low" },
  { minRank: 25001, maxRank: Number.MAX_SAFE_INTEGER, confidence: "Very Low" },
];

export const NEET_MDS_RANK_LEVELS: RankLevel[] = [
  { minRank: 1, maxRank: 250, confidence: "Very High" },
  { minRank: 251, maxRank: 1000, confidence: "High" },
  { minRank: 1001, maxRank: 5000, confidence: "Medium" },
  { minRank: 5001, maxRank: 10000, confidence: "Low" },
  { minRank: 10001, maxRank: Number.MAX_SAFE_INTEGER, confidence: "Very Low" },
];

// export function getRankConfidenceLevel(rank: number): string {
//   if (!Number.isFinite(rank) || rank <= 0) {
//     return "Very Low";
//   }

//   const level = NEET_RANK_LEVELS.find(
//     (item) => rank >= item.minRank && rank <= item.maxRank
//   );

//   return level?.confidence ?? "Very Low";
// }

export function getRankConfidenceLevel(
  rank: number,
  examType: "NEET_UG" | "NEET_PG" | "NEET_MDS"
): string {
  if (!Number.isFinite(rank) || rank <= 0) {
    return "Very Low";
  }

  let levels = NEET_UG_RANK_LEVELS;

  switch (examType) {
    case "NEET_PG":
      levels = NEET_PG_RANK_LEVELS;
      break;

    case "NEET_MDS":
      levels = NEET_MDS_RANK_LEVELS;
      break;

    default:
      levels = NEET_UG_RANK_LEVELS;
  }

  const level = levels.find(
    (item) => rank >= item.minRank && rank <= item.maxRank
  );

  return level?.confidence ?? "Very Low";
}

/**
 * Returns courses linked to a given exam type.
 */
export function getCoursesByExam(examCode: ExamTypeCode): Course[] {
  switch (examCode) {
    case 'NEET_UG':
      return NEET_UG_COURSES;
    case 'NEET_PG':
      return NEET_PG_COURSES;
    case 'NEET_MDS':
      return NEET_MDS_COURSES;
    default:
      return [];
  }
}

type AI_API_TYPE = 'gemini' | 'perplexity';
export const AI_API_TO_USE: AI_API_TYPE|undefined|null = process.env.AI_API_TO_USE as AI_API_TYPE;

export const GTM_ID = process.env.GTM_ID;
