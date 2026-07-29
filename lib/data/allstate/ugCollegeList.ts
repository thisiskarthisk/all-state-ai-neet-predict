import { KARNATAKA_UG_COLLEGES } from '../KarnatakaState/ugCollegeList';
import masterColleges from './UgMasterCollegeList.json';
import { predictCollegesFromMasterData, MatchedCollegeResult } from '../collegeMatcher';

export const MASTER_UG_COLLEGES = masterColleges;

export const ALL_STATE_EXTRA_UG_COLLEGES: any[] = [
  ...masterColleges,
  {
    id: 'aiq-ug-001',
    collegeName: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    collegeType: 'Government',
    course: 'MBBS',
    openingRank: 1,
    closingRank: 55,
    category: 'General (UR)',
  },
  {
    id: 'aiq-ug-002',
    collegeName: 'Maulana Azad Medical College (MAMC), New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    collegeType: 'Government',
    course: 'MBBS',
    openingRank: 10,
    closingRank: 85,
    category: 'General (UR)',
  },
];

export const ALLSTATE_UG_COLLEGES: any[] = [
  ...ALL_STATE_EXTRA_UG_COLLEGES,
  ...KARNATAKA_UG_COLLEGES,
];

export function getMatchingAllStateUGColleges(
  studentRank: number,
  category: string = 'UR',
  course: string = 'MBBS',
  states: string[] = []
): MatchedCollegeResult[] {
  return predictCollegesFromMasterData(
    masterColleges as any[],
    studentRank,
    category,
    states
  );
}
