#!/bin/bash
cd "$(dirname "$0")/.."

echo "Starting test containers (if needed) and migrating DB..."
docker compose up -d db cache
sleep 3
cd backend
npx prisma db push

echo "Running Unit Tests..."
npx jest src/core/use-cases

echo "Running Integration tests..."
npx jest src/infrastructure
cd ..
