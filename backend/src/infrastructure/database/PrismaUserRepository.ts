import { PrismaClient } from '@prisma/client';
import { User } from '../../core/domain/User';
import { UserRepository } from '../../core/ports/UserRepository';

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(user.id, user.hasElectricVehicle);
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        hasElectricVehicle: user.hasElectricVehicle,
      },
      create: {
        id: user.id,
        hasElectricVehicle: user.hasElectricVehicle,
      },
    });
  }
}
