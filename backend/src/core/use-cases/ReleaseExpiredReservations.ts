import { ReservationRepository } from '../ports/ReservationRepository';

export class ReleaseExpiredReservations {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  public async execute(): Promise<void> {
    const today = new Date();
    const activeReservations = await this.reservationRepository.findAllActiveReservations(
      today
    );

    const expiredReservations = activeReservations.filter(
      (res) => !res.checkedIn
    );

    for (const res of expiredReservations) {
      const slot = await this.reservationRepository.findById(res.slotId);
      if (slot) {
        slot.makeAvailable();
        await this.reservationRepository.updateSlot(slot);
      }
      // NEW: Fix the bug by removing the reservation record from the user's active list
      await this.reservationRepository.deleteReservation(res.id);
      
      console.log(`[Release] Expired reservation ${res.id} released slot ${res.slotId}`);
    }
  }
}
