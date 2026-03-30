#!/bin/bash
cd "$(dirname "$0")/.."

echo "Stopping existing containers..."
docker compose down

echo "Building and starting all services..."
docker compose up --build -d

echo "Running prisma migrations in backend..."
sleep 5
docker exec parking_backend npx prisma db push

docker exec parking_backend node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.parkingSlot.createMany({
  data: [
    { id: 'S1', type: 'A', isAvailable: true },
    { id: 'S3', type: 'B', isAvailable: true },
    { id: 'S2', type: 'F', isAvailable: true }
  ],
  skipDuplicates: true,
}).then(() => console.log('Database seeded with slots S1 and S2')).catch(console.error);
"

echo "Access the app at http://localhost:5173"
