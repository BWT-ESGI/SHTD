export class Reservation {
  constructor(
    public readonly id: string,
    public readonly slotId: string,
    public readonly userId: string,
    public readonly date: Date,
    public checkedIn: boolean = false,
    public checkInTime?: Date,
    public isActive: boolean = true
  ) {}

  public checkIn(): void {
    this.checkedIn = true;
    this.checkInTime = new Date();
  }

  public cancel(): void {
    this.isActive = false;
  }

  public updateDate(newDate: Date): void {
    // We could add domain rules here later (e.g. check if past)
    (this as any).date = newDate;
  }
}
