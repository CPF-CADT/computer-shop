import { spawn } from 'child_process';
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set. Example: mysql://user:password@host:port/database");
}

const dbUrl = new URL(process.env.DATABASE_URL);
const dbConfig = {
  host: dbUrl.hostname,
  port: dbUrl.port,
  user: dbUrl.username,
  password: dbUrl.password,
  database: process.env.DB_RECOVERY as string
//   database: dbUrl.pathname.slice(1) 
};


function executeSqlCommand(sql: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Arguments for connecting to the MySQL server without selecting a specific database.
    const mysqlAdminArgs: string[] = [
      `--host=${dbConfig.host}`,
      `--user=${dbConfig.user}`,
      `--password=${dbConfig.password}`,
      ...(dbConfig.port ? [`--port=${dbConfig.port}`] : []), // Add port if it exists
      `-e`, // Option to execute the following command string
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
        console.log(`Successfully executed SQL: "${sql}"`);
        resolve();
      } else {
        reject(new Error(`Error executing SQL. Process exited with code ${code}.\n${stderr}`));
      }
    });
  });
}


async function cleanDatabase(dbName: string): Promise<void> {
    console.log(`--- Cleaning database '${dbName}' ---`);
    try {
        await executeSqlCommand(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
        await executeSqlCommand(`CREATE DATABASE \`${dbName}\`;`);
        console.log(`--- Database '${dbName}' cleaned and recreated successfully ---`);
    } catch (error) {
        console.error(`--- Failed to clean database '${dbName}' ---`);
        throw error;
    }
}


function applyBackup(mysqlCommandArgs: string[], filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`Backup file not found: ${filePath}`));
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
        console.log(`Successfully applied backup: ${filePath}`);
        resolve();
      } else {
        reject(new Error(`Error applying backup '${filePath}'. Process exited with code ${code}.\n${stderr}`));
      }
    });
  });
}

export async function restoreDatabase(backupFiles: string[]): Promise<void> {
  if (!backupFiles || backupFiles.length === 0) {
    console.warn('No backup files provided. Exiting.');
    return;
  }
  
  const dbName = dbConfig.database;
  console.log(`--- Starting database restore for '${dbName}' ---`);

  const mysqlCommandArgs: string[] = [
    `--host=${dbConfig.host}`,
    `--user=${dbConfig.user}`,
    `--password=${dbConfig.password}`,
    ...(dbConfig.port ? [`--port=${dbConfig.port}`] : []), // Add port if it exists
    `--database=${dbName}`,
  ];

  try {
    await cleanDatabase(dbName);

    for (const file of backupFiles) {
      await applyBackup(mysqlCommandArgs, file);
    }
    console.log('\n--- Database restore completed successfully! ---');
  } catch (error) {
    console.error(`\n--- Database restore failed ---`);
    console.error((error as Error).message);
    throw error;
  }
}
