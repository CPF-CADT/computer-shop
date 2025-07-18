import * as fs from 'fs/promises';
import * as path from 'path';
export interface FileStructure {
  name: string;
  type: string;
  dbName: string;
  timestamp: number;
  extension: string;
  create_at: Date;
  isoDateTime: string;
}

export function parseBackupFilename(fileName: string): FileStructure {
  const extension = fileName.slice(fileName.lastIndexOf('.')); // e.g., '.sql'
  const baseName = fileName.replace(/\.[^/.]+$/, ""); // remove extension

  // Split filename parts
  const parts = baseName.split('_');

  if (parts.length < 4) {
    throw new Error("Invalid filename format");
  }

  const type = parts[0]; // 'full'
  const datetimePart = parts.slice(-2).join('_'); // '2025-07-12_21-04-33'
  const dbName = parts.slice(2, -2).join('_'); 

  const isoDateTimeStr = datetimePart.replace('_', 'T'); // e.g., '2025-07-12T21:04:33'
  const create_at = new Date(isoDateTimeStr.replace(/-/g, (m, i) => i >= 11 ? ':' : '-'));

  if (isNaN(create_at.getTime())) {
    throw new Error(`Invalid date format in filename: ${fileName}`);
  }

  return {
    name: fileName,
    type,
    dbName,
    create_at,
    isoDateTime: create_at.toISOString().slice(0, 19),
    timestamp: Math.floor(create_at.getTime() / 1000),
    extension
  };
}

export function findDependFullBackup(fullBackup: FileStructure[], dependBackup: FileStructure): string | null {
  if(dependBackup.type==='full') return null;
  for (const file of fullBackup) {
    if (isSameWeek(file.timestamp, dependBackup.timestamp)) {
      return file.name;
    }
  }
  return null;
}


export function getStartOfWeek(timestamp: number): number {
  const date = new Date(timestamp * 1000);
  const day = date.getDay(); 
  const diff = (day === 0 ? 6 : day - 1); 
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - diff);
  return date.getTime();
}

export function isSameWeek(mainTimestamp: number, checkTimestamp: number): boolean {
  return getStartOfWeek(mainTimestamp) === getStartOfWeek(checkTimestamp);
}


export async function getFileNames(folderPath: string): Promise<FileStructure[]> {
  try {
    const entries = await fs.readdir(folderPath);
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(folderPath, entry);
      const stat = await fs.stat(fullPath);
      if (stat.isFile()) {
        files.push(entry);
      }
    }

    return files.map(parseBackupFilename);
  } catch (error) {
    console.error('Error reading folder:', error);
    return [];
  }
}