import { ReservationRepository } from '../ports/ReservationRepository';

export class GetParkingStats {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  public async execute() {
    const allReservations = await this.reservationRepository.findAllReservations();
    const allSlots = await this.reservationRepository.getAllSlots();

    const totalSlots = allSlots.length;
    const evSlots = allSlots.filter(s => s.type === 'F').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayReservations = allReservations.filter(r => 
      r.date >= today && r.date < tomorrow && r.isActive
    );

    const occupiedCount = todayReservations.length;
    const occupancyRate = totalSlots > 0 ? (occupiedCount / totalSlots) * 100 : 0;

    const checkIns = todayReservations.filter(r => r.checkedIn).length;
    const noShowCount = todayReservations.filter(r => !r.checkedIn && r.date < new Date()).length;

    return {
      totalSlots,
      evSlots,
      occupiedCount,
      occupancyRate: Math.round(occupancyRate),
      checkIns,
      noShowCount,
      totalReservationsHistory: allReservations.length
    };
  }
}
