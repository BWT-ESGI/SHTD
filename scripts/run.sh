#!/bin/bash
cd "$(dirname "$0")/.."

echo "Stopping existing containers..."
docker compose down -v

echo "Building and starting all services..."
docker compose up --build -d

echo "Running prisma migrations in backend..."
sleep 5
docker exec parking_backend npx prisma db push

echo "Seeding test users..."
docker exec parking_backend node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.upsert({
  where: { email: 'admin@company.com' },
  update: {},
  create: { id: 'sec-1', email: 'admin@company.com', role: 'SECRETARY', hasElectricVehicle: false }
}).then(() => console.log('User admin@company.com (SECRETARY) seeded')).catch(console.error);

prisma.user.upsert({
  where: { email: 'boss@company.com' },
  update: {},
  create: { id: 'man-1', email: 'boss@company.com', role: 'MANAGER', hasElectricVehicle: false }
}).then(() => console.log('User boss@company.com (MANAGER) seeded')).catch(console.error);

prisma.user.upsert({
  where: { email: 'user@company.com' },
  update: {},
  create: { id: 'emp-1', email: 'user@company.com', role: 'EMPLOYEE', hasElectricVehicle: true }
}).then(() => console.log('User user@company.com (EMPLOYEE EV) seeded')).catch(console.error);
"

docker exec parking_backend node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.parkingSlot.createMany({
  data: [
    { id: 'A01', type: 'F', isAvailable: true },
    { id: 'A02', type: 'F', isAvailable: true },
    { id: 'A03', type: 'F', isAvailable: true },
    { id: 'A04', type: 'F', isAvailable: true },
    { id: 'A05', type: 'F', isAvailable: true },
    { id: 'A06', type: 'F', isAvailable: true },
    { id: 'A07', type: 'F', isAvailable: true },
    { id: 'A08', type: 'F', isAvailable: true },
    { id: 'A09', type: 'F', isAvailable: true },
    { id: 'A10', type: 'F', isAvailable: true },
    { id: 'B01', type: 'A', isAvailable: true },
    { id: 'B02', type: 'A', isAvailable: true },
    { id: 'B03', type: 'A', isAvailable: true },
    { id: 'B04', type: 'A', isAvailable: true },
    { id: 'B05', type: 'A', isAvailable: true },
    { id: 'B06', type: 'A', isAvailable: true },
    { id: 'B07', type: 'A', isAvailable: true },
    { id: 'B08', type: 'A', isAvailable: true },
    { id: 'B09', type: 'A', isAvailable: true },
    { id: 'B10', type: 'A', isAvailable: true },
    { id: 'C01', type: 'A', isAvailable: true },
    { id: 'C02', type: 'A', isAvailable: true },
    { id: 'C03', type: 'A', isAvailable: true },
    { id: 'C04', type: 'A', isAvailable: true },
    { id: 'C05', type: 'A', isAvailable: true },
    { id: 'C06', type: 'A', isAvailable: true },
    { id: 'C07', type: 'A', isAvailable: true },
    { id: 'C08', type: 'A', isAvailable: true },
    { id: 'C09', type: 'A', isAvailable: true },
    { id: 'C10', type: 'A', isAvailable: true },
    { id: 'D01', type: 'A', isAvailable: true },
    { id: 'D02', type: 'A', isAvailable: true },
    { id: 'D03', type: 'A', isAvailable: true },
    { id: 'D04', type: 'A', isAvailable: true },
    { id: 'D05', type: 'A', isAvailable: true },
    { id: 'D06', type: 'A', isAvailable: true },
    { id: 'D07', type: 'A', isAvailable: true },
    { id: 'D08', type: 'A', isAvailable: true },
    { id: 'D09', type: 'A', isAvailable: true },
    { id: 'D10', type: 'A', isAvailable: true },
    { id: 'E01', type: 'A', isAvailable: true },
    { id: 'E02', type: 'A', isAvailable: true },
    { id: 'E03', type: 'A', isAvailable: true },
    { id: 'E04', type: 'A', isAvailable: true },
    { id: 'E05', type: 'A', isAvailable: true },
    { id: 'E06', type: 'A', isAvailable: true },
    { id: 'E07', type: 'A', isAvailable: true },
    { id: 'E08', type: 'A', isAvailable: true },
    { id: 'E09', type: 'A', isAvailable: true },
    { id: 'E10', type: 'A', isAvailable: true },
    { id: 'F01', type: 'F', isAvailable: true },
    { id: 'F02', type: 'F', isAvailable: true },
    { id: 'F03', type: 'F', isAvailable: true },
    { id: 'F04', type: 'F', isAvailable: true },
    { id: 'F05', type: 'F', isAvailable: true },
    { id: 'F06', type: 'F', isAvailable: true },
    { id: 'F07', type: 'F', isAvailable: true },
    { id: 'F08', type: 'F', isAvailable: true },
    { id: 'F09', type: 'F', isAvailable: true },
    { id: 'F10', type: 'F', isAvailable: true }
  ]
}).then(() => console.log('Database seeded')).catch(console.error);
"

echo "Access the app at http://localhost:5173"
