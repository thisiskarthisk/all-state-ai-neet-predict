let cachedList: any[] | null = null;

export function getPgMasterCollegeList(): any[] {
  if (cachedList) return cachedList;
  try {
    const list = require('./PgMasterCollegeList.json') as any[];
    if (Array.isArray(list)) {
      cachedList = list;
      return cachedList;
    }
  } catch (err) {
    console.error('Failed to require PgMasterCollegeList.json:', err);
  }
  return [];
}

export default getPgMasterCollegeList;
