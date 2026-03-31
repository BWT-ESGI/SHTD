import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaReservationRepository } from '../database/PrismaReservationRepository';
import { PrismaUserRepository } from '../database/PrismaUserRepository';
import { BullMessageQueue } from '../queue/BullMessageQueue';
import { CreateReservation } from '../../core/use-cases/CreateReservation';
import { CheckInReservation } from '../../core/use-cases/CheckInReservation';
import { ReleaseExpiredReservations } from '../../core/use-cases/ReleaseExpiredReservations';
import { createExpressRouter } from './ExpressRouter';

// To keep the test simple without requiring a real external Redis:
jest.mock('bullmq');

describe('Integration Test: API -> Use Case -> DB', () => {
  let app: express.Express;
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
    const repository = new PrismaReservationRepository(prisma);
    const userRepository = new PrismaUserRepository(prisma);
    const messageQueue = new BullMessageQueue('test-queue', 'redis://localhost:6379');
    const createReservation = new CreateReservation(repository, userRepository, messageQueue);
    const checkInReservation = new CheckInReservation(repository);
    const releaseExpiredReservations = new ReleaseExpiredReservations(repository);
    
    app = express();
    app.use(express.json());
    app.use('/api', createExpressRouter(createReservation, checkInReservation, releaseExpiredReservations, repository, prisma));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should fetch slots', async () => {
    const res = await request(app).get('/api/slots');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Note: To make the POST test work reliably we need a slotted seeded in the DB.
  // We skip it explicitly or rely on the mock for true isolation, 
  // but as an integration test it verifies the route is connected.
  it('should return 400 for unknown slot reservation', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({
        slotId: 'invalid-id',
        userId: 'test-user',
        date: new Date().toISOString()
      });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Slot not found.');
  });
});
