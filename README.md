# Parking Reservation System

Ce projet est un système de réservation de parking développé en appliquant l'Architecture Hexagonale.

## Itération 1 :

L'objectif de cette itération est de mettre en place les fondations du projet sans coder de fonctionnalités métier : structure de dossiers, documentation (ADR, diagrammes C4) et automatisation de base.

### Architecture Documentation

- [Architecture Diagram (C4)](docs/architecture.md)
- [ADRs - Architecture Decision Records](docs/adr/)

### Prérequis

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) (prévu pour l'itération 2)
- Bash ou équivalent pour exécuter les scripts.

### Démarrage Rapide

Des scripts d'automatisation se trouvent dans le dossier `scripts/` :

```bash
# Pour builder le projet (simulation)
./scripts/build.sh

# Pour démarrer l'infrastructure complète (Base de données et Queue)
./scripts/run.sh

# Pour lancer les tests (simulation)
./scripts/test.sh
```

### Stack Technique Prévue

- TypeScript
- Node.js (Fastify)
- React
- PostgreSQL
- Redis
