// Simple in-memory OTP storage with 10-minute expiry
interface OtpEntry {
  otp: string;
  expiresAt: number;
}

const otpMap = new Map<string, OtpEntry>();

export function storeOtp(phone: string, otp: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now
  otpMap.set(cleanPhone, { otp, expiresAt });
}

export function getStoredOtp(phone: string): OtpEntry | undefined {
  const cleanPhone = phone.replace(/\D/g, '');
  return otpMap.get(cleanPhone);
}

export function clearStoredOtp(phone: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  otpMap.delete(cleanPhone);
}
