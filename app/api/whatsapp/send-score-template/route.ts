import { NextRequest, NextResponse } from 'next/server';
import { sendWatiScoreTemplate } from '@/lib/wati';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, name } = body;

    const cleanPhone = String(phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit WhatsApp number.' },
        { status: 400 }
      );
    }

    const watiResult = await sendWatiScoreTemplate(cleanPhone, name || 'Student');

    if (watiResult.success) {
      return NextResponse.json({
        success: true,
        message: `Score template message sent successfully to +91 ${cleanPhone} via WhatsApp.`,
        data: watiResult.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: watiResult.error || 'Failed to send WhatsApp score template message via Wati.',
          data: watiResult.data,
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('[API /api/whatsapp/send-score-template] Internal Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error while sending score template.' },
      { status: 500 }
    );
  }
}
