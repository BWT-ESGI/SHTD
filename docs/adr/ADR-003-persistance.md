# ADR 003: Persistance avec PostgreSQL

## Statut
Accepté

## Contexte
Le Parking Reservation System manipule des informations critiques comme l'état des réservations, l'inventaire des places de parking et les profils utilisateurs. Ces données nécessitent des garanties transactionnelles strictes et des relations.

## Décision
Nous choisissons PostgreSQL comme base de données principale.

## Conséquences
- **Avantages** : Conformité ACID garantissant la cohérence des réservations. Puissance des requêtes relationnelles pour l'historique et les rapports. Écosystème riche et maturité.
- Maitrise de la stack technique par l'équipe

- **Inconvénients** : Nécessite une gestion rigoureuse des migrations de schéma.
