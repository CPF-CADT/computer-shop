import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
dotenv.config();

import * as allModels from './models';
import 'reflect-metadata'; 

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
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
  logging: false,
  models: Object.values(allModels),
});

export async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL');
  } catch (error) {
    console.error(' Unable to connect:', error);
    throw error;
  }
}
