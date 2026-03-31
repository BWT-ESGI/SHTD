import { ReservationRepository } from '../ports/ReservationRepository';
import { Reservation } from '../domain/Reservation';

export class CheckInReservation {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  public async execute(reservationId: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.getReservationById(
      reservationId
    );

    if (!reservation) {
      throw new Error('Reservation not found.');
    }

    // Check if reservation is for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reservationDate = new Date(reservation.date);
    reservationDate.setHours(0, 0, 0, 0);

    if (reservationDate.getTime() !== today.getTime()) {
      throw new Error('Check-in only allowed on the day of reservation.');
    }

    if (reservation.checkedIn) {
      throw new Error('Already checked in.');
    }

    reservation.checkIn();

    await this.reservationRepository.updateReservation(reservation);

    return reservation;
  }
}
