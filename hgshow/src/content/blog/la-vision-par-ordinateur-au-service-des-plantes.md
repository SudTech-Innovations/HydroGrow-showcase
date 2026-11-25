---
_schema: default
date: 2025-12-02T00:00:00Z
updated: 2026-11-25
title: "Vision par ordinateur en hydroponie : voir les plantes"
tags:
  - computer vision
  - innovation
  - time-lapse
author: Nicolas Vinckier
thumb_image:
  image: /images/blog/blog2.webp
  image_alt: Oeil cybernétique sur une feuille
featured_image:
  image: /images/blog/blog2.webp
  image_alt: Analyse visuelle d'une laitue par IA
seo:
  page_description: "Vision par ordinateur en hydroponie : la caméra prévue par HydroGrow pour les time-lapses et le repérage visuel du stress des plantes."
  canonical_url:
  featured_image: /images/blog/featured-camera-grow.jpg
  featured_image_alt: Analyse visuelle IA
  author_twitter_handle:
  open_graph_type: article
  no_index: false
draft: false
---

Les courbes sont précieuses : savoir que le [pH reste stable à 6,0](/blog/ph-en-hydroponie-pourquoi-quelques-dixiemes-changent-tout/) et que l'[EC (concentration en nutriments)](/blog/ec-en-hydroponie-plus-de-nutriments-ne-veut-pas-dire-plus-de-croissance/) est à 1,8 mS/cm est essentiel. Mais elles ne montrent pas la plante. C'est le rôle de la vision par ordinateur : l'analyse automatique d'images.

Le **Pack Total IA** d'HydroGrow prévoit ainsi, en plus des sondes, une caméra de type **ESP32-CAM** (un petit module caméra connecté). Voici à quoi elle doit servir.

## Un time-lapse automatique de la culture

Réaliser soi-même un time-lapse (une vidéo accélérée) demande de fixer une caméra et de gérer le stockage et l'alimentation. HydroGrow est conçu pour s'en charger :

- une photo à intervalle réglable, par exemple toutes les heures ;
- en fin de cycle, une courte vidéo générée par l'application, de la graine à la récolte ;
- un support concret pour comparer la vitesse de croissance après un changement de recette, ou pour montrer son travail.

## Repérer le stress sur les feuilles

Les sondes immergées renseignent sur l'eau qui alimente les racines, mais qui observe les feuilles ? L'analyse d'images est conçue pour aider à repérer :

- **le flétrissement :** le réservoir peut être plein alors que la plante souffre de la chaleur ou d'un problème racinaire ;
- **les taches sur les feuilles :** carence ou ravageur, à confirmer par une inspection ;
- **la chlorose :** un jaunissement des feuilles, parfois discret à ses débuts.

La caméra ne pose pas de diagnostic à elle seule. Elle complète la prévention des [maladies en hydroponie](/blog/hydroponie-maladies-sans-terre-risques/) et la [détection précoce par les mesures](/blog/detecter-probleme-avant-symptomes/).

## Un score de santé lisible

L'application prévoit un **score de santé de 0 à 100 %**, accompagné d'animations qui signalent l'urgence d'un coup d'œil. L'[IA Nexus](/blog/comprendre-architecture-ia-nexus/) pourra croiser ces observations avec les mesures de la solution nutritive pour affiner ses conseils.

HydroGrow est en cours de développement. [Découvrir le Pack Total IA](/pricing/)
