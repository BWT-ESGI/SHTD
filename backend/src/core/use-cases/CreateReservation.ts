import { ParkingSlot, SlotType } from '../domain/ParkingSlot';
import { Reservation } from '../domain/Reservation';
import { ReservationRepository } from '../ports/ReservationRepository';
import { UserRepository } from '../ports/UserRepository';
import { MessageQueue } from '../ports/MessageQueue';

export class CreateReservation {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly userRepository: UserRepository,
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

    // New restriction: Electric vehicles only for 'F' slots
    if (slot.type === 'F') {
      const user = await this.userRepository.findById(userId);
      if (!user || !user.hasElectricVehicle) {
        throw new Error('Electric slots (Type F) are reserved for electric vehicles only.');
      }
    }

    if (requiredType && slot.type !== requiredType) {
      throw new Error(`Slot is not of the required type: ${requiredType}.`);
    }

    const hasActive = await this.reservationRepository.hasActiveReservation(
      userId,
      date
    );

    if (hasActive) {
      throw new Error('You already have an active reservation for this day.');
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
