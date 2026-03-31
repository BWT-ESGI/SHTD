import { PrismaClient } from '@prisma/client';
import { ReservationRepository } from '../../core/ports/ReservationRepository';
import { ParkingSlot, SlotType } from '../../core/domain/ParkingSlot';
import { Reservation } from '../../core/domain/Reservation';

export class PrismaReservationRepository implements ReservationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAvailableSlots(date: Date): Promise<ParkingSlot[]> {
    // We assume availability doesn't change per date for now, or date logic is elsewhere
    const slots = await this.prisma.parkingSlot.findMany({
      where: {
        isAvailable: true,
      },
    });

    return slots.map(
      (s) => new ParkingSlot(s.id, s.type as SlotType, s.isAvailable)
    );
  }

  public async findById(slotId: string): Promise<ParkingSlot | null> {
    const slot = await this.prisma.parkingSlot.findUnique({
      where: { id: slotId },
    });

    if (!slot) return null;

    return new ParkingSlot(slot.id, slot.type as SlotType, slot.isAvailable);
  }

  public async saveReservation(reservation: Reservation): Promise<void> {
    await this.prisma.reservation.create({
      data: {
        id: reservation.id,
        slotId: reservation.slotId,
        userId: reservation.userId,
        date: reservation.date,
      },
    });
  }

  public async updateSlot(slot: ParkingSlot): Promise<void> {
    await this.prisma.parkingSlot.update({
      where: { id: slot.id },
      data: {
        isAvailable: slot.isAvailable,
      },
    });
  }

  public async getReservationById(id: string): Promise<Reservation | null> {
    const res = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!res) return null;

    return new Reservation(
      res.id,
      res.slotId,
      res.userId,
      res.date,
      res.checkedIn,
      res.checkInTime || undefined
    );
  }

  public async updateReservation(reservation: Reservation): Promise<void> {
    await this.prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        checkedIn: reservation.checkedIn,
        checkInTime: reservation.checkInTime,
      },
    });
  }

  public async getUserReservations(userId: string): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return reservations.map(
      (res) =>
        new Reservation(
          res.id,
          res.slotId,
          res.userId,
          res.date,
          res.checkedIn,
          res.checkInTime || undefined
        )
    );
  }

  public async findAllActiveReservations(date: Date): Promise<Reservation[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const reservations = await this.prisma.reservation.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return reservations.map(
      (res) =>
        new Reservation(
          res.id,
          res.slotId,
          res.userId,
          res.date,
          res.checkedIn,
          res.checkInTime || undefined
        )
    );
  }

  public async hasActiveReservation(userId: string, date: Date): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const count = await this.prisma.reservation.count({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return count > 0;
  }
}
