import { NextRequest, NextResponse } from 'next/server';
import { getStoredOtp, clearStoredOtp } from '@/lib/otpStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp } = body;

    const cleanPhone = String(phone || '').replace(/\D/g, '');
    const cleanOtp = String(otp || '').trim();

    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Valid 10-digit WhatsApp number required.' },
        { status: 400 }
      );
    }

    if (!cleanOtp || cleanOtp.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Valid 4-digit OTP required.' },
        { status: 400 }
      );
    }

    const storedEntry = getStoredOtp(cleanPhone);

    if (!storedEntry) {
      return NextResponse.json(
        { success: false, error: 'OTP expired or not requested. Please click Resend OTP.' },
        { status: 400 }
      );
    }

    if (Date.now() > storedEntry.expiresAt) {
      clearStoredOtp(cleanPhone);
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new OTP code.' },
        { status: 400 }
      );
    }

    if (storedEntry.otp !== cleanOtp) {
      return NextResponse.json(
        { success: false, error: 'Incorrect OTP code. Please check your WhatsApp.' },
        { status: 400 }
      );
    }

    // OTP verified successfully -> clear stored OTP
    clearStoredOtp(cleanPhone);

    return NextResponse.json({
      success: true,
      message: 'WhatsApp OTP verified successfully!',
    });
  } catch (err: any) {
    console.error('[API /api/otp/verify] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Server error while verifying OTP.' },
      { status: 500 }
    );
  }
}
