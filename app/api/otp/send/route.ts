import { NextRequest, NextResponse } from 'next/server';
import { sendWatiOtp } from '@/lib/wati';
import { storeOtp } from '@/lib/otpStore';

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

    // Generate random 4-digit OTP code
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store OTP in memory (10 minutes expiry)
    storeOtp(cleanPhone, generatedOtp);

    // Call Wati API using template neet_predict_otp_verification and {{1}} parameter
    const watiResult = await sendWatiOtp(cleanPhone, generatedOtp, name || 'Student');

    if (watiResult.success) {
      return NextResponse.json({
        success: true,
        message: `OTP sent successfully to +91 ${cleanPhone} via WhatsApp.`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: watiResult.error || 'Failed to send WhatsApp message via Wati.',
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('[API /api/otp/send] Internal Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error while sending OTP.' },
      { status: 500 }
    );
  }
}
