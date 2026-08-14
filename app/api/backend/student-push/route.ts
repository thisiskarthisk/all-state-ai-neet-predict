import { NextRequest, NextResponse } from 'next/server';
import { storeStudentProfile } from '@/lib/backend';
import { LOGGER } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      mobile_no,
      name,
      email,
      home_state,
      neet_rank,
      ug_or_pg,
      course,
      category,
    } = body;

    const payload = {
      mobile_no: String(mobile_no || '').replace(/\D/g, ''),
      name: String(name || '').trim(),
      email: String(email || '').trim(),
      home_state: String(home_state || '').trim(),
      neet_rank: String(neet_rank || '').trim(),
      ug_or_pg: String(ug_or_pg || 'UG').toUpperCase().includes('PG') ? 'PG' : 'UG',
      course: String(course || 'MBBS').trim(),
      category: String(category || 'General').trim(),
    };

    const success = await storeStudentProfile(payload);

    if (success) {
      LOGGER.log('[Back-end Student Push Success]');
      return NextResponse.json({ success: true });
    } else {
      LOGGER.error('[Back-end Student Push Error Response]');
      return NextResponse.json({ success: false }, { status: 500 });
    }
  } catch (err: any) {
    LOGGER.error('[Back-end Student Push Internal Error]:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to push student data.' }, { status: 500 });
  }
}
