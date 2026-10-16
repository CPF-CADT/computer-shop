import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
dotenv.config();

import * as allModels from './models';
import 'reflect-metadata'; 

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_SSL,
} = process.env;

if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASS || !DB_NAME) {
  throw new Error('FATAL ERROR: One or more required DB environment variables are missing.');
}

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  dialectOptions: DB_SSL === 'true'
    ? {
        ssl: {
          ca: fs.readFileSync(path.join(__dirname, 'ca.pem'), 'utf8'),
          rejectUnauthorized: true,
        },
      }
    : undefined,
  logging: false,
  models: Object.values(allModels),
});

export async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync();
    }
    console.log('Connected to MySQL');
  } catch (error) {
    console.error(' Unable to connect:', error);
    throw error;
  }
}
