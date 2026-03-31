import { CreateReservation } from './CreateReservation';
import { ReservationRepository } from '../ports/ReservationRepository';
import { MessageQueue } from '../ports/MessageQueue';
import { ParkingSlot } from '../domain/ParkingSlot';
import { Reservation } from '../domain/Reservation';

import { UserRepository } from '../ports/UserRepository';
import { User } from '../domain/User';
import { UserRole } from '../domain/UserRole';

describe('CreateReservation Use Case', () => {
  let mockRepository: jest.Mocked<ReservationRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockQueue: jest.Mocked<MessageQueue>;
  let useCase: CreateReservation;

  beforeEach(() => {
    mockRepository = {
      findAvailableSlots: jest.fn(),
      findById: jest.fn(),
      saveReservation: jest.fn(),
      updateSlot: jest.fn(),
      getReservationById: jest.fn(),
      updateReservation: jest.fn(),
      getUserReservations: jest.fn(),
      findAllActiveReservations: jest.fn(),
      hasActiveReservation: jest.fn(),
    } as any;

    mockUserRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    mockQueue = {
      publish: jest.fn(),
    };

    useCase = new CreateReservation(mockRepository, mockUserRepository, mockQueue);
  });

  it('should create a reservation successfully', async () => {
    const slot = new ParkingSlot('slot-1', 'A', true);
    mockRepository.findById.mockResolvedValue(slot);
    mockUserRepository.findById.mockResolvedValue(new User('user-1', 'test@test.com', UserRole.EMPLOYEE, false));
    (mockRepository.hasActiveReservation as jest.Mock).mockResolvedValue(false);

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
    mockUserRepository.findById.mockResolvedValue(new User('user-1', 'test@test.com', UserRole.EMPLOYEE, true));

    await expect(useCase.execute('slot-1', 'user-1', new Date(), 'A')).rejects.toThrow('Slot is not of the required type: A.');
  });

  it('should fail if electric slot is reserved by non-electric user', async () => {
    const slot = new ParkingSlot('slot-1', 'F', true);
    mockRepository.findById.mockResolvedValue(slot);
    mockUserRepository.findById.mockResolvedValue(new User('user-1', 'test@test.com', UserRole.EMPLOYEE, false));

    await expect(useCase.execute('slot-1', 'user-1', new Date())).rejects.toThrow('Electric slots (Type F) are reserved for electric vehicles only.');
  });

  it('should succeed if electric slot is reserved by electric user', async () => {
    const slot = new ParkingSlot('slot-1', 'F', true);
    mockRepository.findById.mockResolvedValue(slot);
    mockUserRepository.findById.mockResolvedValue(new User('user-1', 'test@test.com', UserRole.EMPLOYEE, true));
    (mockRepository.hasActiveReservation as jest.Mock).mockResolvedValue(false);

    const reservation = await useCase.execute('slot-1', 'user-1', new Date());
    expect(reservation).toBeDefined();
  });
});
