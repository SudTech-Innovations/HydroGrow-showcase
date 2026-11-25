---
_schema: default
date: 2025-11-15T00:00:00Z
updated: 2026-11-25
title: "IA en hydroponie : comment Nexus est conçu pour décider"
tags:
  - intelligence artificielle
  - technologie
  - innovation
author: Nicolas Vinckier
thumb_image:
  image: /images/blog/blog1.webp
  image_alt: Visualisation réseau neuronal
featured_image:
  image: /images/blog/blog1.webp
  image_alt: Représentation abstraite de Nexus
seo:
  page_description: "Intelligence artificielle en hydroponie : comment Pulse, Orbit et Nexus sont conçus pour surveiller, anticiper et arbitrer avec des garde-fous."
  canonical_url:
  featured_image: /images/blog/featured-ai-brain.jpg
  featured_image_alt: Cerveau IA HydroGrow
  author_twitter_handle:
  open_graph_type: article
  no_index: false
draft: false
---

En hydroponie, l'intelligence artificielle touche à du vivant : une erreur de dosage ne s'annule pas d'un clic, et une solution nutritive (l'eau enrichie qui alimente les plantes) trop concentrée peut compromettre une récolte.

C'est pourquoi **HydroGrow** ne prévoit pas une seule intelligence artificielle, mais **trois agents spécialisés**, c'est-à-dire trois programmes ayant chacun un rôle. Voici l'architecture sur laquelle nous travaillons.

## Pulse, Orbit et Nexus : trois rôles

**Pulse** est l'agent de terrain. Il regarde le présent, sur une fenêtre de 12 heures. Si le [pH (acidité de l'eau)](/blog/ph-en-hydroponie-pourquoi-quelques-dixiemes-changent-tout/) chute brutalement ou si la [température de l'eau](/blog/pourquoi-surveiller-temperature-eau-hydroponie/) dépasse le seuil fixé (par exemple 26 °C), il est conçu pour déclencher l'alerte ou les mesures correctives sans chercher d'abord à optimiser la croissance. Sa priorité : protéger la culture.

**Orbit** joue le rôle d'agronome virtuel. Il analyse les cycles sur 30 jours ou plus pour préparer le rendement, par exemple en proposant d'ajuster l'équilibre entre azote et potassium à l'approche de la floraison. Sa priorité : optimiser dans la durée.

**Nexus** est l'arbitre. Il reçoit les propositions des deux autres et tranche, à l'aide d'un **score de confiance** (une note qui exprime à quel point une proposition est jugée sûre) et de **garde-fous biologiques**, des limites fixes inscrites dans le programme.

## Un exemple d'arbitrage

| Situation | Proposition | Décision prévue |
|---|---|---|
| Orbit veut pousser la culture, Pulse détecte un manque d'eau | Augmenter les apports | La protection de la culture passe avant l'optimisation |
| Orbit suggère une [EC (concentration en nutriments)](/blog/ec-en-hydroponie-plus-de-nutriments-ne-veut-pas-dire-plus-de-croissance/) de 3,5 mS/cm, limite réglée à 3 | Augmenter le dosage | Ordre bloqué |

Les valeurs de ce tableau sont des exemples de réglage, pas des recommandations pour votre culture.

## Des garde-fous contre les erreurs

Les IA génératives, capables de produire du texte, peuvent inventer des faits : on parle d'« hallucinations ». Pour une culture, c'est inacceptable. Notre système **Edgia**, une IA qui s'exécute sur place (*Edge AI*), prévoit que, sous un score de confiance de **85 %**, la proposition soit rejetée au profit de règles simples fondées sur des seuils.

Un score élevé n'est pas une preuve. Il s'ajoute aux limites fixes et à votre contrôle, sans les remplacer.

## Ce dont l'IA a besoin

La qualité d'un conseil dépend de ce qu'on lui fournit :

- des sondes entretenues et étalonnées ;
- l'espèce cultivée, son stade et le type de système ;
- les interventions notées : appoint, vidange, changement de recette ;
- des limites adaptées à votre culture et revues à chaque étape.

Une mesure fausse peut conduire à une proposition fausse, même avec un bon modèle.

Gardez aussi une trace des propositions refusées et de leur raison. Elle permet de voir si une limite est trop stricte, si une sonde dérive ou si le conseil ne correspond pas à votre conduite de culture. L'IA reste une aide : l'observation des plantes et votre expérience comptent dans chaque décision.

## Les questions à poser à un outil

Avant de confier un dosage à une IA, quelle qu'elle soit, vérifiez :

1. Pouvez-vous voir la raison d'une proposition ?
2. Les actions sont-elles limitées et enregistrées ?
3. Pouvez-vous refuser ou arrêter une action à tout moment ?
4. Que se passe-t-il si un capteur tombe en panne ou si la connexion est coupée ?

Commencez par comparer les conseils à vos propres décisions, sans action automatique. Cette période d'observation montre où l'outil se trompe. Demandez enfin où sont stockées les données de votre exploitation, qui peut y accéder et comment les récupérer.

L'idée n'est pas de confier votre culture à un système opaque, mais de combiner des agents qui se contrôlent pendant que vous gardez la main : c'est notre approche de l'[automatisation hydroponique](/blog/automatiser-sans-perdre-controle-hydroponie/). Elle s'appuiera aussi, à terme, sur la [vision par ordinateur](/blog/la-vision-par-ordinateur-au-service-des-plantes/).

HydroGrow est en cours de développement : cette architecture peut encore évoluer. [Voir les formules prévues avec l'IA Nexus](/pricing/)
