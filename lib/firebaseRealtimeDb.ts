import { LOGGER } from '@/lib/logger';
import { readLocalFile, writeLocalFile } from './file';

const FIREBASE_DB_URL = (process.env.FIREBASE_DATABASE_URL || '').trim().replace(/\/$/, '');
const FIREBASE_DB_SECRET = (process.env.FIREBASE_DATABASE_SECRET || '').trim();

function firebaseTokenURL(path: string): string {
  if (!FIREBASE_DB_URL) {
    throw new Error('FIREBASE_DATABASE_URL is not configured — cannot persist the Zoho refresh token');
  }

  const url = `${FIREBASE_DB_URL}/${path}.json`;

  return FIREBASE_DB_SECRET ? `${url}?auth=${encodeURIComponent(FIREBASE_DB_SECRET)}` : url;
}

/**
 * Read data from Firebase Realtime DB
*/
export async function readFromFirebase(path: string): Promise<any | null> {
  try {
    // Get data from local file in development mode
    if (process.env.NODE_ENV === 'development') {
      return JSON.parse(await readLocalFile('storage', path, 'firebase.json') || '{}');
    }

    const response = await fetch(firebaseTokenURL(path), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      LOGGER.error('[Firebase Realtime DB] Firebase token read failed:', response.status, await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    LOGGER.error('[Firebase Realtime DB] Firebase token read error:', error);
    return null;
  }
}

/**
 * Write data to Firebase Realtime DB
 */
export async function writeToFirebase(path: string, record: any): Promise<void> {
  try {
    // Store data to local file in development mode
    if (process.env.NODE_ENV === 'development') {
      await writeLocalFile('storage', path, 'firebase.json', JSON.stringify(record));
      return;
    }

    const response = await fetch(firebaseTokenURL(path), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
      cache: 'no-store',
    });

    if (!response.ok) {
      LOGGER.error('[Firebase Realtime DB] Firebase token write failed:', response.status, await response.text());
    }
  } catch (error) {
    LOGGER.error('[Firebase Realtime DB] Firebase token write error:', error);
  }
}