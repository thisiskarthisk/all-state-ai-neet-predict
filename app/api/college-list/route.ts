import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import ugList from '@/lib/data/allstate/UgMasterCollegeList.json';

export const dynamic = 'force-dynamic';

let cachedPgData: any[] | null = null;
let cachedPgSpecialties: string[] | null = null;

// Helper to normalize raw college types (Govt = Government, Society, Trust; Pvt = Private; Deemed)
function normalizeCollegeType(typeRaw: any): string {
  if (!typeRaw) return 'Govt';
  const t = String(typeRaw).toLowerCase();

  if (t.includes('deem')) {
    return 'Deemed';
  }
  if (t.includes('pvt') || t.includes('private') || t.includes('priv') || t.includes('vate')) {
    return 'Private';
  }
  if (t.includes('govt') || t.includes('govern') || t.includes('society') || t.includes('trust')) {
    return 'Govt';
  }
  return 'Govt';
}

function getPgData(): any[] {
  if (!cachedPgData) {
    try {
      const filePath = path.join(process.cwd(), 'lib/data/allstate/PgMasterCollegeList.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const rawData = JSON.parse(fileContent);
      // Map and normalize Type field for all PG colleges
      cachedPgData = rawData.map((item: any) => ({
        ...item,
        Type: normalizeCollegeType(item.Type),
        OriginalType: item.Type,
      }));
    } catch (err) {
      console.error('Error reading PgMasterCollegeList.json:', err);
      cachedPgData = [];
    }
  }
  return cachedPgData || [];
}

function getPgSpecialties(courseFilter: string = 'ALL'): string[] {
  const list = getPgData();
  const set = new Set<string>();
  const filterUpper = courseFilter.toUpperCase().trim();

  for (const item of list) {
    const courseName = String(item['Course Name'] || '').trim();
    if (courseName) {
      if (filterUpper === 'ALL') {
        set.add(courseName);
      } else if (filterUpper === 'MD' && courseName.toUpperCase().startsWith('MD')) {
        set.add(courseName);
      } else if (filterUpper === 'MS' && courseName.toUpperCase().startsWith('MS')) {
        set.add(courseName);
      }
    }
  }
  return Array.from(set).sort();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const exam = (searchParams.get('exam') || 'UG').toUpperCase();
    const query = (searchParams.get('q') || '').trim().toLowerCase();
    const courseType = (searchParams.get('course') || 'ALL').trim().toUpperCase();
    const specialty = (searchParams.get('specialty') || 'ALL').trim();
    const action = searchParams.get('action') || '';

    // Action to fetch specialty list for PG dropdown
    if (exam === 'PG' && action === 'specialties') {
      return NextResponse.json({ success: true, specialties: getPgSpecialties(courseType) });
    }

    if (exam === 'PG') {
      let list = getPgData();

      // Filter by Degree Course (MD vs MS)
      if (courseType === 'MD') {
        list = list.filter((item: any) => String(item['Course Name'] || '').toUpperCase().startsWith('MD'));
      } else if (courseType === 'MS') {
        list = list.filter((item: any) => String(item['Course Name'] || '').toUpperCase().startsWith('MS'));
      }

      // Filter by Specialty
      if (specialty !== 'ALL') {
        const specLower = specialty.toLowerCase();
        list = list.filter((item: any) => {
          const course = String(item['Course Name'] || '').trim().toLowerCase();
          return course.includes(specLower);
        });
      }

      // Filter by search query (matching name, course, city, state, or normalized college type)
      if (query) {
        list = list.filter((c: any) => {
          const name = (c['College Name'] || c.name || '').toLowerCase();
          const course = (c['Course Name'] || '').toLowerCase();
          const city = (c['City'] || c.city || '').toLowerCase();
          const state = (c['State'] || c.state || '').toLowerCase();
          const type = (c['Type'] || '').toLowerCase();
          const origType = (c['OriginalType'] || '').toLowerCase();

          // If query is 'govt', 'private', 'pvt', 'society', 'trust', 'deemed'
          let typeMatch = false;
          if (query === 'govt' || query === 'government' || query === 'society' || query === 'trust') {
            typeMatch = type === 'govt' || origType.includes('govt') || origType.includes('society') || origType.includes('trust');
          } else if (query === 'pvt' || query === 'private') {
            typeMatch = type === 'private' || origType.includes('pvt') || origType.includes('private');
          } else if (query === 'deemed') {
            typeMatch = type === 'deemed' || origType.includes('deem');
          }

          return name.includes(query) || course.includes(query) || city.includes(query) || state.includes(query) || type.includes(query) || typeMatch;
        });
      }

      return NextResponse.json({ success: true, data: list.slice(0, 60) });
    }

    // Default: UG List from UgMasterCollegeList.json
    let list: any[] = ugList.map((item: any) => ({
      ...item,
      Type: normalizeCollegeType(item.Type || item.collegeType),
    }));

    if (query) {
      list = list.filter((c: any) => {
        const name = (c['College Name'] || c.name || '').toLowerCase();
        const city = (c['City'] || c.city || '').toLowerCase();
        const state = (c['State'] || c.state || '').toLowerCase();
        const id = (c['ID'] || c.id || '').toLowerCase();
        const type = (c['Type'] || '').toLowerCase();
        return name.includes(query) || city.includes(query) || state.includes(query) || id.includes(query) || type.includes(query);
      });
    }

    return NextResponse.json({ success: true, data: query ? list.slice(0, 60) : list });
  } catch (err: any) {
    console.error('Error in college-list API:', err);
    return NextResponse.json({ error: 'Failed to load colleges' }, { status: 500 });
  }
}
