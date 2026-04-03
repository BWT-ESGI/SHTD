import { ReservationRepository } from '../ports/ReservationRepository';
import { Reservation } from '../domain/Reservation';

export class AdminUpdateReservation {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  public async execute(
    reservationId: string,
    updates: {
      date?: Date;
      checkedIn?: boolean;
      isActive?: boolean;
    }
  ): Promise<Reservation> {
    const reservation = await this.reservationRepository.getReservationById(reservationId);

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (updates.date) {
      reservation.updateDate(updates.date);
    }

    if (updates.checkedIn !== undefined) {
      reservation.checkedIn = updates.checkedIn;
      if (updates.checkedIn) {
        reservation.checkInTime = new Date();
      } else {
        reservation.checkInTime = undefined;
      }
    }

    if (updates.isActive !== undefined) {
      if (updates.isActive) {
        // Re-activating: might need more logic but for now just set flag
        (reservation as any).isActive = true;
      } else {
        reservation.cancel();
      }
    }

    await this.reservationRepository.updateReservation(reservation);
    return reservation;
  }
}
