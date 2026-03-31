import { ReservationRepository } from '../ports/ReservationRepository';
import { UserRole } from '../domain/UserRole';

export class UpdateReservation {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  public async execute(
    reservationId: string,
    initiator: { id: string, role: UserRole },
    newDate: Date
  ): Promise<any> {
    const reservation = await this.reservationRepository.getReservationById(reservationId);

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    // Role check: Only the owner or a SECRETARY can update
    if (reservation.userId !== initiator.id && initiator.role !== UserRole.SECRETARY) {
      throw new Error('Forbidden: You can only update your own reservations unless you are a SECRETARY');
    }

    reservation.updateDate(newDate);
    await this.reservationRepository.saveReservation(reservation);

    return reservation;
  }
}
