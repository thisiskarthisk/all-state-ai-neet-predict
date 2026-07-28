import { KARNATAKA_PG_COLLEGES, KarnatakaPGCollegeCutoff } from '../KarnatakaState/pgCollegeList';

export const ALL_STATE_EXTRA_PG_COLLEGES: any[] = [
  {
    id: 'aiq-pg-001',
    collegeName: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    collegeType: 'Government',
    specialty: 'MD General Medicine',
    specialtyCode: 'MD_GEN_MED',
    openingRank: 1,
    closingRank: 15,
    category: 'General (UR)',
  },
  {
    id: 'aiq-pg-002',
    collegeName: 'Maulana Azad Medical College (MAMC), New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    collegeType: 'Government',
    specialty: 'MD General Medicine',
    specialtyCode: 'MD_GEN_MED',
    openingRank: 10,
    closingRank: 35,
    category: 'General (UR)',
  },
  {
    id: 'aiq-pg-003',
    collegeName: 'King George’s Medical University (KGMU), Lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    collegeType: 'Government',
    specialty: 'MD General Medicine',
    specialtyCode: 'MD_GEN_MED',
    openingRank: 40,
    closingRank: 180,
    category: 'General (UR)',
  },
];

export const ALLSTATE_PG_COLLEGES: any[] = [
  ...ALL_STATE_EXTRA_PG_COLLEGES,
  ...KARNATAKA_PG_COLLEGES,
];

export function getMatchingAllStatePGColleges(
  studentRank: number,
  category: string = 'UR',
  course: string = 'MD_GEN_MED'
) {
  return ALLSTATE_PG_COLLEGES.filter((col: any) => {
    return studentRank <= (col.closingRank || 50000) + 10000;
  });
}
