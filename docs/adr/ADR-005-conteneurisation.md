# ADR 005: Conteneurisation

## Statut
Accepté

## Contexte
Afin d'assurer que l'application s'exécute de manière identique en développement, en test et en production, et pour faciliter l'onboarding de nouveaux développeurs sur ce Parking Reservation System.

## Décision
Toutes les briques logicielles (Web App, API, Postgres, Redis) seront conteneurisées à l'aide de Docker et orchestrées localement via Docker Compose.

## Conséquences
- **Avantages** : Isolation de l'environnement, simplification de l'installation, et gestion facilitée de la configuration via des variables d'environnement.
- **Inconvénients** : 