export class Reservation {
  constructor(
    public readonly id: string,
    public readonly slotId: string,
    public readonly userId: string,
    public readonly date: Date
  ) {}
}
