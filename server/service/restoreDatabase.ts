import { spawn } from 'child_process';
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_RECOVERY,
};

if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
  throw new Error("Missing required database environment variables.");
}

function executeSqlCommand(sql: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const mysqlAdminArgs: string[] = [
      `--host=${dbConfig.host}`,
      `--user=${dbConfig.user}`,
      `--password=${dbConfig.password}`,
      ...(dbConfig.port ? [`--port=${dbConfig.port}`] : []),
      `-e`,
      sql,
    ];

    const mysqlProcess = spawn('mysql', mysqlAdminArgs);

    let stderr = '';
    mysqlProcess.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    mysqlProcess.on('error', (err: Error) => {
      reject(new Error(`Failed to start mysql process for SQL command: ${err.message}`));
    });

    mysqlProcess.on('close', (code: number | null) => {
      if (code === 0) {
        console.log(`Executed SQL: "${sql}"`);
        resolve();
      } else {
        reject(new Error(` SQL execution failed. Exit code: ${code}\n${stderr}`));
      }
    });
  });
}

async function cleanDatabase(dbName: string): Promise<void> {
  console.log(`--- Cleaning database '${dbName}' ---`);
  try {
    await executeSqlCommand(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
    await executeSqlCommand(`CREATE DATABASE \`${dbName}\`;`);
    console.log(`--- Database '${dbName}' cleaned and recreated ---`);
  } catch (error) {
    console.error(` Failed to clean database '${dbName}'`);
    throw error;
  }
}

function applyBackup(mysqlCommandArgs: string[], filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error(` Backup file not found: ${filePath}`));
    }

    const mysqlProcess = spawn('mysql', mysqlCommandArgs);
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

    fileStream.pipe(mysqlProcess.stdin);

    let stderr = '';
    mysqlProcess.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    mysqlProcess.on('error', (err: Error) => {
      reject(new Error(`Failed to start mysql process for '${filePath}': ${err.message}`));
    });

    mysqlProcess.on('close', (code: number | null) => {
      if (code === 0) {
        console.log(`Applied backup: ${filePath}`);
        resolve();
      } else {
        reject(new Error(`Backup failed '${filePath}'. Exit code: ${code}\n${stderr}`));
      }
    });
  });
}

export async function restoreDatabase(backupFiles: string[]): Promise<void> {
  if (!backupFiles || backupFiles.length === 0) {
    console.warn('⚠️ No backup files provided.');
    return;
  }

  const dbName = dbConfig.database;
  console.log(`--- Starting restore for '${dbName}' ---`);

  const mysqlCommandArgs: string[] = [
    `--host=${dbConfig.host}`,
    `--user=${dbConfig.user}`,
    `--password=${dbConfig.password}`,
    ...(dbConfig.port ? [`--port=${dbConfig.port}`] : []),
    `--database=${dbName}`,
  ];

  try {
    await cleanDatabase(dbName as string);
    for (const file of backupFiles) {
      await applyBackup(mysqlCommandArgs, file);
    }
    console.log('\ Database restore completed!');
  } catch (error) {
    console.error('\n Database restore failed');
    console.error((error as Error).message);
    throw error;
  }
}
