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
}
