import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaReservationRepository } from './infrastructure/database/PrismaReservationRepository';
import { BullMessageQueue } from './infrastructure/queue/BullMessageQueue';
import { CreateReservation } from './core/use-cases/CreateReservation';
import { createExpressRouter } from './infrastructure/web/ExpressRouter';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Initialize infrastructure
const prisma = new PrismaClient();
const repository = new PrismaReservationRepository(prisma);

// Setup Redis URL from environment or default to docker compose cache
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const messageQueue = new BullMessageQueue('reservations', REDIS_URL);

// Initialize use case
const createReservation = new CreateReservation(repository, messageQueue);

// Initialize web adapter
const router = createExpressRouter(createReservation, repository);
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
