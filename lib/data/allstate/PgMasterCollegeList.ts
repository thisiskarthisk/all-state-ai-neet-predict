let cachedList: any[] | null = null;

export function getPgMasterCollegeList(): any[] {
  if (cachedList) return cachedList;
  if (typeof window !== 'undefined') return [];

  try {
    const req = eval('require');
    const fs = req('fs');
    const path = req('path');
    const jsonPath = path.join(process.cwd(), 'lib/data/allstate/PgMasterCollegeList.json');
    if (fs.existsSync(jsonPath)) {
      const fileContent = fs.readFileSync(jsonPath, 'utf-8');
      cachedList = JSON.parse(fileContent);
      return cachedList || [];
    }
  } catch (err) {
    console.error('Error loading PgMasterCollegeList.json:', err);
  }

  return [];
}

export default getPgMasterCollegeList;
