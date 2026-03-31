export class Reservation {
  constructor(
    public readonly id: string,
    public readonly slotId: string,
    public readonly userId: string,
    public readonly date: Date,
    public checkedIn: boolean = false,
    public checkInTime?: Date
  ) {}

  public checkIn(): void {
    this.checkedIn = true;
    this.checkInTime = new Date();
  }
}
