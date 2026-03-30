#!/usr/bin/env bash

echo "[Run] Démarrage de l'environnement Parking Reservation System..."
dockercompose -f ../docker-compose.yml up -d
echo "[Run] Services démarrés (Postgres, Redis)."
