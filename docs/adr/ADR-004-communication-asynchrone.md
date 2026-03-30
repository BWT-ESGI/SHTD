# ADR 004: Communication Asynchrone

## Statut
Accepté

## Contexte
Certains traitements, tels que l'envoi d'emails de confirmation de réservation aux utilisateurs, peuvent prendre du temps et pourraient bloquer la réponse de l'API s'ils étaient exécutés de manière synchrone.

## Décision
Mise en place d'une Queue (système de file d'attente) pour la communication asynchrone (ex: Redis avec BullMQ ou équivalent). Les tâches non critiques pour le thread principal de réponse (comme les notifications par email) seront publiées dans cette queue.

## Conséquences
- **Avantages** : Découplage des processus lents, amélioration des temps de réponse de l'API web, et meilleure résilience (possibilité de retenter l'envoi d'emails en cas d'échec de l'adaptateur).
- **Inconvénients** : Introduction d'une nouvelle brique d'infrastructure (Redis/Queue) à maintenir et monitorer. Complexité liée au debugging de l'asynchrone.
