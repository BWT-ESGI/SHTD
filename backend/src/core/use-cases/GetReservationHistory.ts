import { ReservationRepository } from '../ports/ReservationRepository';
import { Reservation } from '../domain/Reservation';

export class GetReservationHistory {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  public async execute(): Promise<Reservation[]> {
    return this.reservationRepository.findAllReservations();
  }
}
