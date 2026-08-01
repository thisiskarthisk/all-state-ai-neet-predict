import masterColleges from '../allstate/UgMasterCollegeList.json';

export const KARNATAKA_UG_COLLEGES: any[] = (masterColleges as any[]).filter(
  (c: any) => (c.State || '').toLowerCase() === 'karnataka'
);

export function getMatchingKarnatakaUGColleges(studentRank: number) {
  return KARNATAKA_UG_COLLEGES;
}
