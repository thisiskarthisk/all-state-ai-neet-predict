import { generatePDF } from '@/lib/pdf';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const pdfBuffer = await generatePDF(req);

    if (pdfBuffer != null) {
      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="counselling-plan.pdf"',
        },
      });
    }
  } catch (error: any) {
    console.error('[PDF Route] Error:', error);
  }

  return NextResponse.json({ error: 'Failed to generate counselling kit.' }, { status: 500 });
}
