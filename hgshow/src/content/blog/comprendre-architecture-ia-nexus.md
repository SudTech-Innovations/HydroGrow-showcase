---
_schema: default
date: 2025-11-15T00:00:00Z
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

Dire qu'un produit « a de l'IA » est devenu banal. En hydroponie, pourtant, une erreur de dosage ne s'annule pas d'un clic : une solution nutritive trop concentrée peut compromettre une récolte.

C'est pourquoi **HydroGrow** ne prévoit pas une seule intelligence artificielle, mais **trois agents spécialisés** qui travaillent ensemble. Voici l'architecture sur laquelle nous travaillons.

## Pulse : la surveillance en temps réel

**Pulse** est l'agent de terrain. Il regarde le présent, sur une fenêtre de 12 heures.

- **Son rôle :** surveiller les signaux vitaux de la culture.
- **Sa logique :** si le [pH (acidité de l'eau)](/blog/ph-en-hydroponie-pourquoi-quelques-dixiemes-changent-tout/) chute brutalement ou si la [température de l'eau](/blog/pourquoi-surveiller-temperature-eau-hydroponie/) dépasse le seuil fixé (par exemple 26 °C), il déclenche l'alerte ou les mesures correctives sans chercher d'abord à optimiser la croissance.
- **Sa priorité :** protéger la culture.

## Orbit : la stratégie à long terme

**Orbit** joue le rôle d'agronome virtuel. Il analyse les cycles sur 30 jours ou plus.

- **Son rôle :** préparer le rendement.
- **Sa logique :** proposer, par exemple, d'ajuster l'équilibre entre azote et potassium à l'approche de la floraison.
- **Sa priorité :** optimiser dans la durée.

## Nexus : l'arbitre

Orbit peut vouloir pousser la culture, alors que Pulse détecte un stress hydrique (un manque d'eau pour la plante). **Nexus** reçoit les propositions des deux agents et tranche, à l'aide d'un **score de confiance** et de **garde-fous biologiques**, des limites fixes inscrites dans le programme.

_Exemple :_ Orbit suggère une [EC (concentration en nutriments)](/blog/ec-en-hydroponie-plus-de-nutriments-ne-veut-pas-dire-plus-de-croissance/) de 3,5 mS/cm, mais la limite de sécurité est réglée à 3,0 : Nexus bloque l'ordre.

## Des garde-fous contre les « hallucinations »

Les modèles de langage et les IA génératives peuvent inventer des faits. Pour une culture, c'est inacceptable. Notre système **Edgia** (une IA qui s'exécute sur place, appelée *Edge AI*) prévoit que, sous un score de confiance de **85 %**, la proposition de l'IA soit rejetée au profit de règles simples fondées sur des seuils.

L'idée n'est pas de confier votre culture à un système opaque, mais de combiner des agents qui se contrôlent, pendant que vous gardez la main : c'est notre approche de l'[automatisation hydroponique](/blog/automatiser-sans-perdre-controle-hydroponie/). Elle s'appuie aussi, à terme, sur la [vision par ordinateur](/blog/la-vision-par-ordinateur-au-service-des-plantes/).

[Voir les formules prévues avec l'IA Nexus](/pricing/)
