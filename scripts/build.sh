#!/bin/bash
cd "$(dirname "$0")/.."

echo "Building Backend..."
cd backend
npm install --legacy-peer-deps
npx prisma generate
npm run build
cd ..

echo "Building Frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

echo "Build complete."
