import crypto from 'node:crypto';
import { LOGGER } from './logger';

const BACK_END_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || '';
const BACK_END_SECRET = process.env.NEXT_PUBLIC_BACKEND_SECRET || process.env.BACKEND_SECRET || '';

// Log for testing the script file directly in nodejs
// LOGGER.log('\n\n\n\nBACK_END_URL:', BACK_END_URL);
// LOGGER.log('BACK_END_SECRET:', BACK_END_SECRET);

async function sendRequestToBackend(endpoint: string, method: 'GET' | 'POST', payload: any): Promise<any> {
  const ts = Math.floor(Date.now() / 1000).toString();
  const body = JSON.stringify(payload);

  const sig = crypto.createHmac('sha256', BACK_END_SECRET).update(`${ts}.${body}`).digest('hex');

  const res = await fetch(`${BACK_END_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-Timestamp': ts,
      'X-Signature': sig,
    },
    body: body,
  });

  if (!res.ok) {
    try {
      return await res.json();
    } catch {}

    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();

  return data;
}

export async function storeStudentProfile(data: any): Promise<boolean> {
  const response = await sendRequestToBackend('students', 'POST', data);

  LOGGER.log('storeStudentProfile response:', response);

  return response && typeof response === 'object' ? response.success === true : false;
}
