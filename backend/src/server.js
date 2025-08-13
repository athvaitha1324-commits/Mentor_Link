import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';
import mentorRoutes from './routes/mentor.routes.js';
import menteeRoutes from './routes/mentee.routes.js';
import hodRoutes from './routes/hod.routes.js';
import taskRoutes from './routes/task.routes.js';
import proofRoutes from './routes/proof.routes.js';
import reportRoutes from './routes/report.routes.js';
import startReminders from './cron/reminders.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Mentor-Mentee API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentees', menteeRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/proofs', proofRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mentormentee';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startReminders();
    });
  } catch (err) {
    console.error('Startup error', err);
    process.exit(1);
  }
}

start();