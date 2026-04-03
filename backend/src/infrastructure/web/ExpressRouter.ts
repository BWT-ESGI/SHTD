import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { CreateReservation } from '../../core/use-cases/CreateReservation';
import { CheckInReservation } from '../../core/use-cases/CheckInReservation';
import { ReleaseExpiredReservations } from '../../core/use-cases/ReleaseExpiredReservations';
import { ReservationRepository } from '../../core/ports/ReservationRepository';
import { UserRole } from '../../core/domain/UserRole';
import { GetParkingStats } from '../../core/use-cases/GetParkingStats';
import { GetReservationHistory } from '../../core/use-cases/GetReservationHistory';
import { AdminUpdateReservation } from '../../core/use-cases/AdminUpdateReservation';
import { authenticateToken, checkRole, AuthRequest, JWT_SECRET } from './authMiddleware';

export function createExpressRouter(
  createReservation: CreateReservation,
  checkInReservation: CheckInReservation,
  releaseExpiredReservations: ReleaseExpiredReservations,
  reservationRepository: ReservationRepository,
  prisma: PrismaClient,
  getParkingStats: GetParkingStats,
  getReservationHistory: GetReservationHistory,
  adminUpdateReservation: AdminUpdateReservation
): Router {
  const router = Router();

  router.post('/auth/login', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid email' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/slots', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const today = new Date();
      const slots = await reservationRepository.getSlotsWithStatus(today);
      res.json(slots);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/reservations/user/:userId', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.userId as string;
      const reservations = await reservationRepository.getUserReservations(userId);
      res.json(reservations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/reservations', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { slotId, date, requiredType } = req.body;
      const parsedDate = new Date(date || Date.now());
      if (!req.user) throw new Error('User not authenticated');
      
      const reservation = await createReservation.execute(
        slotId,
        req.user.id,
        parsedDate,
        requiredType
      );
      res.status(201).json(reservation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/reservations/:id/check-in', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id as string;
      const reservation = await checkInReservation.execute(id);
      res.json(reservation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/debug/trigger-11am', authenticateToken, checkRole([UserRole.MANAGER]), async (req: AuthRequest, res: Response) => {
    try {
      console.log('[Debug] Manually triggering 11 AM clean-up...');
      await releaseExpiredReservations.execute();
      res.json({ message: '11 AM clean-up executed successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // PROTECTED ADMIN ROUTES
  router.get('/admin/users', authenticateToken, checkRole([UserRole.MANAGER, UserRole.SECRETARY]), async (req: AuthRequest, res: Response) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/admin/slots', authenticateToken, checkRole([UserRole.MANAGER, UserRole.SECRETARY]), async (req: AuthRequest, res: Response) => {
    try {
      const slots = await reservationRepository.getAllSlots();
      res.json(slots);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.patch('/admin/slots/:id', authenticateToken, checkRole([UserRole.SECRETARY, UserRole.MANAGER]), async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id as string;
      const { isAvailable } = req.body;
      const slot = await reservationRepository.findById(id);
      if (!slot) throw new Error('Slot not found');
      
      if (isAvailable !== undefined) {
        if (isAvailable) slot.makeAvailable();
        else slot.reserve();
      }
      
      await reservationRepository.updateSlot(slot);
      res.json(slot);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/admin/stats', authenticateToken, checkRole([UserRole.MANAGER]), async (req: AuthRequest, res: Response) => {
    try {
      const stats = await getParkingStats.execute();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/admin/reservations', authenticateToken, checkRole([UserRole.MANAGER, UserRole.SECRETARY]), async (req: AuthRequest, res: Response) => {
    try {
      const history = await getReservationHistory.execute();
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.patch('/admin/reservations/:id', authenticateToken, checkRole([UserRole.SECRETARY, UserRole.MANAGER]), async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id as string;
      const { date, checkedIn, isActive } = req.body;
      const updated = await adminUpdateReservation.execute(id, {
        date: date ? new Date(date) : undefined,
        checkedIn,
        isActive
      });
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
