import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
dotenv.config();

import * as allModels from './models';

if (!process.env.DATABASE_URL) {
  throw new Error('FATAL ERROR: DATABASE_URL environment variable is not set.');
}

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
    models: Object.values(allModels),
});

export async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection successfully.');
    } catch (error) {
        console.error('Unable to connect : ', error);
        throw error;
    }
}
