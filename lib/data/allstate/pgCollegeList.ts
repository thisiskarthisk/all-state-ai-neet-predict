import { getPgMasterCollegeList } from './PgMasterCollegeList';
import { predictPgCollegesFromMasterData } from '../collegeMatcher';

export const ALLSTATE_PG_COLLEGES: any[] = getPgMasterCollegeList();

export function getMatchingAllStatePGColleges(
  studentRank: number,
  category: string = 'General',
  course: string = 'ALL',
  speciality: string = 'ALL',
  states: string[] = []
) {
  return predictPgCollegesFromMasterData(
    ALLSTATE_PG_COLLEGES,
    studentRank,
    category,
    course,
    speciality,
    states
  );
}
