import { Router, Request, Response } from 'express';
import { CreateReservation } from '../../core/use-cases/CreateReservation';
import { CheckInReservation } from '../../core/use-cases/CheckInReservation';
import { ReleaseExpiredReservations } from '../../core/use-cases/ReleaseExpiredReservations';
import { ReservationRepository } from '../../core/ports/ReservationRepository';

export function createExpressRouter(
  createReservation: CreateReservation,
  checkInReservation: CheckInReservation,
  releaseExpiredReservations: ReleaseExpiredReservations,
  reservationRepository: ReservationRepository
): Router {
  const router = Router();

  router.get('/slots', async (req: Request, res: Response) => {
    try {
      const today = new Date();
      const slots = await reservationRepository.findAvailableSlots(today);
      res.json(slots);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/reservations/user/:userId', async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId as string;
      const reservations = await reservationRepository.getUserReservations(userId);
      res.json(reservations);
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

  router.post('/reservations/:id/check-in', async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const reservation = await checkInReservation.execute(id);
      res.json(reservation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/debug/trigger-11am', async (req: Request, res: Response) => {
    try {
      console.log('[Debug] Manually triggering 11 AM clean-up...');
      await releaseExpiredReservations.execute();
      res.json({ message: '11 AM clean-up executed successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
