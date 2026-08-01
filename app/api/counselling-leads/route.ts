import { NextResponse } from 'next/server';
import { fetchZohoLeads } from '@/lib/zoho';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const perPageParam = parseInt(searchParams.get('per_page') || '10', 10);

    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const perPage = isNaN(perPageParam) || perPageParam < 1 ? 10 : perPageParam;

    const leadsData = await fetchZohoLeads(page, perPage);

    return NextResponse.json(leadsData, { status: 200 });
  } catch (error: any) {
    console.error('[API /api/counselling-leads GET Error]:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch counselling leads from Zoho CRM',
        details: error.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
