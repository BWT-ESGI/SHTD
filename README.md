# Parking Reservation System

Ce projet est un système de réservation de parking automatisé, développé en interne pour une société. Cette appliation sera utilisé par des non-initiés à l'informatique.


### Documentation

- [Architecture Diagram (C4)](docs/architecture.md)
- [ADRs - Architecture Decision Records](docs/adr/)

### Prérequis

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) (prévu pour l'itération 2)
- Bash ou équivalent pour exécuter les scripts.

### Démarrage Rapide

Des scripts d'automatisation se trouvent dans le dossier `scripts/` :

```bash
cd backend

cp .env.example .env
# modifier les variables d'environnement

cd ..

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
