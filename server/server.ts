import dotenv from 'dotenv';
import app from './app'; 
import { connectToDatabase } from './db/sequelize';
import { TelegramBot } from './service/TelgramBot';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDatabase();
    console.log('Database connected successfully.');

    const bot = new TelegramBot();
    bot.startPolling();
    console.log('Telegram Bot is polling for updates.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); 
  }
};

startServer();