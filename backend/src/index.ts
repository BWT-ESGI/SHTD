import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaReservationRepository } from './infrastructure/database/PrismaReservationRepository';
import { BullMessageQueue } from './infrastructure/queue/BullMessageQueue';
import { CreateReservation } from './core/use-cases/CreateReservation';
import { CheckInReservation } from './core/use-cases/CheckInReservation';
import { ReleaseExpiredReservations } from './core/use-cases/ReleaseExpiredReservations';
import { createExpressRouter } from './infrastructure/web/ExpressRouter';
import cors from 'cors';
import cron from 'node-cron';

import { PrismaUserRepository } from './infrastructure/database/PrismaUserRepository';
import { User } from './core/domain/User';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Initialize infrastructure
const prisma = new PrismaClient();
const repository = new PrismaReservationRepository(prisma);
const userRepository = new PrismaUserRepository(prisma);

// Setup Redis URL from environment or default to docker compose cache
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const messageQueue = new BullMessageQueue('reservations', REDIS_URL);

// Initialize use cases
const createReservation = new CreateReservation(repository, userRepository, messageQueue);
const checkInReservation = new CheckInReservation(repository);
const releaseExpiredReservations = new ReleaseExpiredReservations(repository);

// Initialize web adapter
const router = createExpressRouter(
  createReservation,
  checkInReservation,
  releaseExpiredReservations,
  repository,
  prisma
);
app.use('/api', router);

// Setup Cron Job at 11:00 AM every day
cron.schedule('0 11 * * *', async () => {
  console.log('[Cron] Running daily reservation release at 11:00 AM...');
  try {
    await releaseExpiredReservations.execute();
    console.log('[Cron] Success!');
  } catch (err) {
    console.error('[Cron] Error:', err);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
