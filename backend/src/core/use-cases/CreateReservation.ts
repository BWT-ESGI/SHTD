import { ParkingSlot, SlotType } from '../domain/ParkingSlot';
import { Reservation } from '../domain/Reservation';
import { ReservationRepository } from '../ports/ReservationRepository';
import { MessageQueue } from '../ports/MessageQueue';

export class CreateReservation {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly messageQueue: MessageQueue
  ) {}

  public async execute(
    slotId: string,
    userId: string,
    date: Date,
    requiredType?: SlotType
  ): Promise<Reservation> {
    const slot = await this.reservationRepository.findById(slotId);

    if (!slot) {
      throw new Error('Slot not found.');
    }

    if (!slot.isAvailable) {
      throw new Error('Slot is not available.');
    }

    if (requiredType && slot.type !== requiredType) {
      throw new Error(`Slot is not of the required type: ${requiredType}.`);
    }

    slot.reserve();

    const reservation = new Reservation(
      this.generateId(),
      slot.id,
      userId,
      date
    );

    // Persist changes
    await this.reservationRepository.updateSlot(slot);
    await this.reservationRepository.saveReservation(reservation);

    // Publish event
    await this.messageQueue.publish('ReservationCreated', {
      reservationId: reservation.id,
      userId,
      slotId,
      date,
    });

    return reservation;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
