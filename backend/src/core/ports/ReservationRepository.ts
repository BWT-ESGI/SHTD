import { ParkingSlot } from '../domain/ParkingSlot';
import { Reservation } from '../domain/Reservation';

export interface ReservationRepository {
  findAvailableSlots(date: Date): Promise<ParkingSlot[]>;
  findById(slotId: string): Promise<ParkingSlot | null>;
  saveReservation(reservation: Reservation): Promise<void>;
  updateSlot(slot: ParkingSlot): Promise<void>;
  
  getReservationById(id: string): Promise<Reservation | null>;
  updateReservation(reservation: Reservation): Promise<void>;
  getUserReservations(userId: string): Promise<Reservation[]>;
  findAllActiveReservations(date: Date): Promise<Reservation[]>;
  hasActiveReservation(userId: string, date: Date): Promise<boolean>;
  deleteReservation(id: string): Promise<void>;
  getSlotsWithStatus(date: Date): Promise<any[]>;
}
