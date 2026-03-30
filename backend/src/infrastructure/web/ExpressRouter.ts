import { Router, Request, Response } from 'express';
import { CreateReservation } from '../../core/use-cases/CreateReservation';
import { ReservationRepository } from '../../core/ports/ReservationRepository';

export function createExpressRouter(
  createReservation: CreateReservation,
  reservationRepository: ReservationRepository
): Router {
  const router = Router();

  router.get('/slots', async (req: Request, res: Response) => {
    try {
      // Assuming today for basic skeleton
      const today = new Date();
      const slots = await reservationRepository.findAvailableSlots(today);
      res.json(slots);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/reservations', async (req: Request, res: Response) => {
    try {
      const { slotId, userId, date, requiredType } = req.body;
      const parsedDate = new Date(date || Date.now());
      const reservation = await createReservation.execute(
        slotId,
        userId || 'employee123',
        parsedDate,
        requiredType
      );
      res.status(201).json(reservation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
