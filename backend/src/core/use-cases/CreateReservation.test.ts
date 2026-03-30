import { CreateReservation } from './CreateReservation';
import { ReservationRepository } from '../ports/ReservationRepository';
import { MessageQueue } from '../ports/MessageQueue';
import { ParkingSlot } from '../domain/ParkingSlot';
import { Reservation } from '../domain/Reservation';

describe('CreateReservation Use Case', () => {
  let mockRepository: jest.Mocked<ReservationRepository>;
  let mockQueue: jest.Mocked<MessageQueue>;
  let useCase: CreateReservation;

  beforeEach(() => {
    mockRepository = {
      findAvailableSlots: jest.fn(),
      findById: jest.fn(),
      saveReservation: jest.fn(),
      updateSlot: jest.fn(),
    };

    mockQueue = {
      publish: jest.fn(),
    };

    useCase = new CreateReservation(mockRepository, mockQueue);
  });

  it('should create a reservation successfully', async () => {
    const slot = new ParkingSlot('slot-1', 'A', true);
    mockRepository.findById.mockResolvedValue(slot);

    const reservation = await useCase.execute('slot-1', 'user-1', new Date(), 'A');

    expect(reservation).toBeInstanceOf(Reservation);
    expect(reservation.slotId).toBe('slot-1');
    expect(slot.isAvailable).toBe(false);
    expect(mockRepository.updateSlot).toHaveBeenCalledWith(slot);
    expect(mockRepository.saveReservation).toHaveBeenCalled();
    expect(mockQueue.publish).toHaveBeenCalledWith('ReservationCreated', expect.any(Object));
  });

  it('should fail if slot not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('unknown-slot', 'user-1', new Date(), 'A')).rejects.toThrow('Slot not found.');
  });

  it('should fail if slot is not available', async () => {
    const slot = new ParkingSlot('slot-1', 'A', false);
    mockRepository.findById.mockResolvedValue(slot);

    await expect(useCase.execute('slot-1', 'user-1', new Date(), 'A')).rejects.toThrow('Slot is not available.');
  });

  it('should fail if slot is wrong type', async () => {
    const slot = new ParkingSlot('slot-1', 'F', true);
    mockRepository.findById.mockResolvedValue(slot);

    await expect(useCase.execute('slot-1', 'user-1', new Date(), 'A')).rejects.toThrow('Slot is not of the required type: A.');
  });
});
