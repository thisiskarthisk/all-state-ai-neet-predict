// // Simple in-memory OTP storage with 10-minute expiry
// interface OtpEntry {
//   otp: string;
//   expiresAt: number;
// }

// const otpMap = new Map<string, OtpEntry>();

// export function storeOtp(phone: string, otp: string) {
//   const cleanPhone = phone.replace(/\D/g, '');
//   const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now
//   otpMap.set(cleanPhone, { otp, expiresAt });
// }

// export function getStoredOtp(phone: string): OtpEntry | undefined {
//   const cleanPhone = phone.replace(/\D/g, '');
//   return otpMap.get(cleanPhone);
// }

// export function clearStoredOtp(phone: string) {
//   const cleanPhone = phone.replace(/\D/g, '');
//   otpMap.delete(cleanPhone);
// }





// Persistent in-memory OTP storage with 10-minute expiry attached to globalThis
interface OtpEntry {
  otp: string;
  expiresAt: number;
}

// Preserve otpMap on globalThis across Next.js API route chunk reloads and dev hot-reloads
const globalForOtp = globalThis as unknown as {
  _otpStoreMap?: Map<string, OtpEntry>;
};

const otpMap = globalForOtp._otpStoreMap ?? new Map<string, OtpEntry>();
globalForOtp._otpStoreMap = otpMap;

function normalizePhone(phone: string): string {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export function storeOtp(phone: string, otp: string) {
  const key = normalizePhone(phone);
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now
  otpMap.set(key, { otp, expiresAt });
  console.log(`[OTP Store] Stored OTP for key ${key}:`, otp);
}

export function getStoredOtp(phone: string): OtpEntry | undefined {
  const key = normalizePhone(phone);
  const entry = otpMap.get(key);
  console.log(`[OTP Store] Retrieved OTP for key ${key}:`, entry?.otp || 'NOT_FOUND');
  return entry;
}

export function clearStoredOtp(phone: string) {
  const key = normalizePhone(phone);
  otpMap.delete(key);
  console.log(`[OTP Store] Cleared OTP for key ${key}`);
}
