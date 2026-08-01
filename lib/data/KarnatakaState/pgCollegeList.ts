import { getPgMasterCollegeList } from '../allstate/PgMasterCollegeList';

export const KARNATAKA_PG_COLLEGES: any[] = getPgMasterCollegeList().filter(
  (c: any) => (c.State || '').toLowerCase() === 'karnataka'
);

export function getMatchingKarnatakaPGColleges(studentRank: number) {
  return KARNATAKA_PG_COLLEGES;
}
