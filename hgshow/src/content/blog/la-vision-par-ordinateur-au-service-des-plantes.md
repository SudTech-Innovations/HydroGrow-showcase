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

La vision par ordinateur en hydroponie, c'est l'analyse automatique d'images des plantes. Les courbes sont précieuses : savoir que le [pH reste stable](/blog/ph-en-hydroponie-pourquoi-quelques-dixiemes-changent-tout/) et que l'[EC (concentration en nutriments)](/blog/ec-en-hydroponie-plus-de-nutriments-ne-veut-pas-dire-plus-de-croissance/) suit la consigne est essentiel. Mais elles ne montrent pas la plante.

Le **Pack Total IA** d'HydroGrow prévoit, en plus des sondes, une caméra de type **ESP32-CAM** (un petit module caméra connecté).

## Un time-lapse automatique de la culture

Réaliser soi-même un time-lapse (une vidéo accélérée) demande de fixer une caméra et de gérer le stockage et l'alimentation. HydroGrow est conçu pour s'en charger :

- une photo à intervalle réglable, par exemple toutes les heures ;
- en fin de cycle, une courte vidéo générée par l'application, de la graine à la récolte ;
- un support concret pour comparer la croissance après un changement de recette, ou pour montrer son travail.

## Repérer le stress sur les feuilles

Les sondes immergées renseignent sur l'eau qui alimente les racines, mais qui observe les feuilles ? L'analyse d'images est conçue pour aider à repérer :

- **le flétrissement :** le réservoir peut être plein alors que la plante souffre de la chaleur ou d'un problème de racines ;
- **les taches :** carence, maladie ou ravageur, à confirmer par une inspection ;
- **la chlorose :** un jaunissement des feuilles, parfois discret à ses débuts.

La caméra ne pose pas de diagnostic à elle seule. Elle complète la prévention des [maladies en hydroponie](/blog/hydroponie-maladies-sans-terre-risques/) et la [détection précoce par les mesures](/blog/detecter-probleme-avant-symptomes/).

## Ce que dit la recherche sur les limites

Un modèle d'analyse d'images apprend à partir d'exemples. Dans [une étude de référence sur la détection de maladies (Mohanty et al., 2016)](https://doi.org/10.3389/fpls.2016.01419), il a reconnu les cas avec 99,35 % de réussite sur des photos de feuilles prises dans les mêmes conditions contrôlées que ses exemples. Sur des images prises dans d'autres conditions, la réussite est tombée à un peu plus de 31 %. Les auteurs soulignent aussi que leurs images montraient des feuilles isolées, vues de dessus, sur un fond uniforme.

Cette étude ne porte pas sur HydroGrow, et les méthodes ont évolué depuis. Elle rappelle une chose utile : un bon résultat en laboratoire ne garantit pas le même résultat dans votre serre. Demandez toujours sur quelles images un outil a été évalué.

## Donner de bonnes images

Quelques précautions aident toute analyse visuelle :

- garder la caméra à la même place et avec le même cadrage ;
- photographier sous une lumière comparable, car un éclairage coloré modifie l'aspect des feuilles ;
- nettoyer l'objectif, exposé à la buée et aux éclaboussures ;
- protéger le matériel et son alimentation de l'eau ;
- vérifier sur place chaque anomalie signalée.

Pensez aussi à ce qui entre dans le champ : si des personnes peuvent apparaître sur les photos, informez-les et orientez la caméra vers les plantes.

Enfin, comparez les images au fil des jours plutôt qu'une photo isolée : une feuille qui se relève le soir ne raconte pas la même chose qu'un affaissement durable. Notez ce que vous constatez sur place, pour confronter chaque alerte à la réalité.

## Un score de santé lisible

L'application prévoit un **score de santé de 0 à 100 %**, accompagné d'animations qui signalent l'urgence. Ce score doit se lire comme une invitation à regarder, pas comme un verdict. L'[IA Nexus](/blog/comprendre-architecture-ia-nexus/) pourra croiser ces observations avec les mesures de la solution nutritive pour affiner ses conseils.

Prévoyez aussi qui consulte les alertes et sous quel délai : une image pertinente ne sert que si quelqu'un va voir la plante. Avant de vous fier à un score, comparez-le pendant plusieurs cultures à votre propre jugement et relevez les oublis comme les fausses alertes. Refaites cette comparaison après tout changement de culture ou d'éclairage.

## La caméra regarde, les capteurs expliquent

Une feuille pâlit : que se passait-il autour d'elle ? C'est le duo que HydroGrow veut former, avec caméra, capteurs, boîtier de contrôle et application dans le même ensemble.

**L'œil, à venir.** La caméra du [Pack Total IA](/pricing/), l'analyse d'images, le score de santé et le time-lapse restent à développer et à valider.

**Le contexte, déjà amorcé.** Des capteurs ont mesuré la température de l'eau, le niveau et le climat, dont la lumière. Une première version du logiciel a affiché ces mesures, tracé leur historique, déclenché des alertes et tenu un carnet de culture. Les sondes de pH et d'EC sont prévues.

**Le verdict, toujours vous.** Une image suspecte, les courbes du même moment, puis votre jugement.

Envie de voir vos plantes autrement ? [Être informé du lancement](/contact/).
