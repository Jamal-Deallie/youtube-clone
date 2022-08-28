import mongoose, { ConnectOptions } from 'mongoose';
import * as dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const DB = process.env.DATABASE || 'mongodb://localhost:27017/youtube-clone';

console.log(DB);
export async function connectDB() {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    } as ConnectOptions);
    logger.info('Connect to database');
    console.log('Connection Successful');
  } catch (err) {
    console.error(err);
  }
}

export async function disconnectDB() {
  await mongoose.connection.close();

  logger.info('Disconnect from database');

  return;
}
