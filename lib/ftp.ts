import * as ftp from 'basic-ftp';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

import { LOGGER } from '@/lib/logger';
import { writeLocalFile } from './file';

export const ftpPublicURLPrefix = process.env.FTP_PUBLIC_URL_PREFIX || '';

export async function storeFileToStorage(buffer: Buffer, filePath: string, fileName: string): Promise<string> {
  // Upload files to local folder in development mode
  if (process.env.NODE_ENV === 'development') {
    const localUploadedPath = await writeLocalFile('uploads', filePath, fileName, buffer);

    return `/${localUploadedPath}`;
  }

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: process.env.FTP_SECURE == 'true',
    });

    const uploadLocation = path.join('/', filePath, fileName);

    LOGGER.log('uploadLocation:', uploadLocation);

    await client.ensureDir(path.posix.dirname(uploadLocation));

    LOGGER.log('Ensured folders');

    const stream = Readable.from(buffer);
    await client.uploadFrom(stream, uploadLocation);

    const publicUrl = `${ftpPublicURLPrefix.replace(/\/$/, '')}/${uploadLocation}`;
    LOGGER.log(`[FTP Success] File uploaded to cPanel: ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    LOGGER.error('[FTP Error] Failed to upload file to cPanel:', err);
    throw err;
  } finally {
    client.close();
  }
}
