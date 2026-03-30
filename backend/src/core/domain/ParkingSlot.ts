export type SlotType = 'A' | 'F'; // A = Auto/Standard, F = Fourgon/Electric (per typical french naming or business rules, but let's stick to 'standard' | 'electric' if undefined, or 'A' and 'F' as per prompt: "A/F pour électrique").

export class ParkingSlot {
  constructor(
    public readonly id: string,
    public readonly type: SlotType,
    public isAvailable: boolean
  ) {}

  public reserve(): void {
    if (!this.isAvailable) {
      throw new Error('Slot is already reserved.');
    }
    this.isAvailable = false;
  }
}
