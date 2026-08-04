import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

function frameFilePath(baseFolder: 'uploads' | 'storage', filePath: string) {
  let localUploadDir = process.cwd();

  if (baseFolder == 'uploads') {
    localUploadDir = path.join(localUploadDir, 'public');
  }

  localUploadDir = path.join(localUploadDir, baseFolder, filePath);

  if (!fs.existsSync(localUploadDir)) {
    fs.mkdirSync(localUploadDir, { recursive: true });
  }

  return localUploadDir;
}

export async function readLocalFile(baseFolder: 'uploads' | 'storage', filePath: string, fileName: string) {
  const localUploadDir = frameFilePath(baseFolder, filePath);

  const localUploadFilePath = path.join(localUploadDir, fileName);

  if (!fs.existsSync(localUploadFilePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(localUploadFilePath, 'utf-8');

  return fileContent;
}

export async function writeLocalFile(baseFolder: 'uploads' | 'storage', filePath: string, fileName: string, content: Buffer|string) {
  const localUploadDir = frameFilePath(baseFolder, filePath);

  const localUploadFilePath = path.join(localUploadDir, fileName);

  await fs.promises.writeFile(localUploadFilePath, Readable.from(content));

  return path.join(baseFolder, filePath, fileName);
}
