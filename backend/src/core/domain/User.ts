export class User {
  constructor(
    public readonly id: string,
    public readonly hasElectricVehicle: boolean
  ) {}

  canReserveElectricSlot(): boolean {
    return this.hasElectricVehicle;
  }
}
