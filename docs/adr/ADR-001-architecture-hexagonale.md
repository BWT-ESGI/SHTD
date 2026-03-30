# ADR 001: Architecture Hexagonale

## Statut
Accepté

## Contexte
Le système de réservation de parking (Parking Reservation System) possède une logique métier centrale (réservation, gestion des places, règles d'attribution) qui doit être indépendante des choix technologiques externes (base de données, interface utilisateur, API web).

## Décision
Nous adoptons l'Architecture Hexagonale (Ports et Adapters) pour ce projet. Le code sera structuré en trois couches principales :
- **Domain** : Entités et règles métier pures.
- **Use Cases** : Orchestration des règles métier et définition des interfaces (Ports).
- **Infrastructure** : Implémentation des Ports (Adapters entrants et sortants comme l'API, la Base de données, etc.).

## Conséquences
- **Avantages** : Isolation du domaine métier, testabilité accrue, flexibilité pour changer d'outils externes.
- **Inconvénients** : Complexité initiale et boilerplate supplémentaires pour la définition des ports et des mappers.
