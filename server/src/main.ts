import express from 'express';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import userRoute from './modules/user/user.route';
import authRoute from './modules/auth/auth.route';
import videoRoute from './modules/videos/video.route';
import { CORS_ORIGIN } from './constants';
import { connectDB } from './utils/dbConn';
import deserializeUser from './middleware/deserializeUser';
dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(deserializeUser);

app.use((req, res, next) => {
  console.log('middleware check');
  next();
});

app.get('/', (req, res) => {
  // Sending the response
  res.send('Hello World!');

  // Ending the response
  res.end();
});

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/videos', videoRoute);

const port = process.env.PORT || 5001;

const server = app.listen(port, async () => {
  await connectDB();
  console.log(`App running on port ${port}...`);
});
