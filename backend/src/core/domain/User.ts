import { UserRole } from './UserRole';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly hasElectricVehicle: boolean = false
  ) {}

  public canReserveElectricSlot(): boolean {
    return this.hasElectricVehicle;
  }

  public get allowedReservationDays(): number {
    if (this.role === UserRole.SECRETARY || this.role === UserRole.MANAGER) {
      return 30;
    }
    return 5;
  }
}
