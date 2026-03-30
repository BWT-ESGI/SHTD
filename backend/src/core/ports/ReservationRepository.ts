import { ParkingSlot } from '../domain/ParkingSlot';
import { Reservation } from '../domain/Reservation';

export interface ReservationRepository {
  findAvailableSlots(date: Date): Promise<ParkingSlot[]>;
  findById(slotId: string): Promise<ParkingSlot | null>;
  saveReservation(reservation: Reservation): Promise<void>;
  updateSlot(slot: ParkingSlot): Promise<void>;
}
