---
date: 2026-08-12
updated: 2026-11-25
title: "EC en hydroponie : plus de nutriments, pas plus de croissance"
tags: ["nutriments", "capteurs", "guide"]
author: "Équipe HydroGrow"
thumb_image: { image: /images/blog/hydroponie-ec.webp, image_alt: Mesure EC dans une installation hydroponique }
featured_image: { image: /images/blog/hydroponie-ec.webp, image_alt: Conductivité de la solution nutritive }
seo: { page_description: "Comprendre l'EC en hydroponie : valeurs repères, risques de sous et de sur-fertilisation, et bon suivi de la solution nutritive.", canonical_url: , featured_image: /images/blog/hydroponie-ec.webp, featured_image_alt: Mesure EC, author_twitter_handle: , open_graph_type: article, no_index: false }
draft: false
---

L'EC en hydroponie, ou conductivité électrique, indique à quel point l'eau conduit le courant, donc approximativement combien de sels y sont dissous. Les engrais hydroponiques étant principalement des sels, elle offre un repère rapide sur la concentration de la solution nutritive, l'eau enrichie qui alimente les plantes.

## Ce que l'EC mesure, et ce qu'elle ne dit pas

L'EC s'exprime en mS/cm (millisiemens par centimètre) ou en dS/m (décisiemens par mètre), [deux unités équivalentes](https://extension.psu.edu/a-water-quality-toolkit-for-greenhouse-and-nursery-production). Certains appareils affichent des µS/cm : 1 000 µS/cm valent 1 mS/cm. D'autres convertissent la mesure en ppm (parties par million) de sels dissous. Pour comparer vos relevés, gardez toujours la même unité.

L'EC donne un total. Elle ne dit ni quel élément manque, ni si les proportions entre éléments sont correctes, et [les différents sels n'y contribuent pas de la même façon](https://ccd.uky.edu/sites/default/files/2025-06/ccd-ta-01_monitoring-ph-ec.pdf). Deux solutions de même EC peuvent donc nourrir les plantes très différemment. Un excès d'un élément peut aussi en bloquer un autre : Penn State donne l'exemple de la tomate, où une dose de potassium dix fois trop forte peut provoquer une carence en azote, même si l'azote est apporté.

## Trop haut, trop bas : deux risques différents

Une EC faible peut signaler une solution trop diluée et s'accompagner [d'une croissance ralentie ou de carences (Oklahoma State University)](https://extension.okstate.edu/fact-sheets/electrical-conductivity-and-ph-guide-for-hydroponics).

À l'inverse, augmenter l'EC ne revient pas à « nourrir davantage » : une solution trop concentrée rend l'absorption de l'eau plus difficile pour la plante. C'est le stress osmotique. Dans un substrat (le support des racines), un excès de sels peut [faire flétrir les plantes alors qu'elles sont arrosées (Penn State)](https://extension.psu.edu/hydroponics-systems-and-principles-of-plant-nutrition-essential-nutrients-function-deficiency-and-excess), avec parfois un feuillage vert foncé, des bords de feuilles brûlés ou des racines qui meurent.

## Quelle EC viser ?

Il n'existe pas d'EC universelle. Les besoins changent selon l'espèce, le stade de croissance, le climat et le système. Deux repères généraux :

- [Oklahoma State University publie des plages par culture](https://extension.okstate.edu/fact-sheets/electrical-conductivity-and-ph-guide-for-hydroponics), par exemple 1,2 à 1,8 mS/cm pour la laitue, 1 à 1,6 pour le basilic, 1,8 à 2,2 pour la fraise et 2 à 4 pour la tomate ;
- [University of Kentucky indique, pour la plupart des plantes en serre](https://ccd.uky.edu/sites/default/files/2025-06/ccd-ta-01_monitoring-ph-ec.pdf), 1,2 à 2 mS/cm en phase de croissance des feuilles et des racines, puis 2,5 à 3,5 mS/cm pendant la floraison et la fructification.

Ce sont des points de départ. Adoptez la plage propre à votre culture, datez chaque changement de stade et observez la réaction des plantes avant de modifier la consigne.

## Interpréter plutôt que compenser

Observez l'EC avec le niveau du réservoir et le [pH de la solution](/blog/ph-en-hydroponie-pourquoi-quelques-dixiemes-changent-tout/). En circuit fermé, où la même solution recircule, ces lectures donnent des pistes :

| Ce que vous constatez | Lecture probable | À vérifier |
|---|---|---|
| Niveau en baisse, EC en hausse | La culture prélève proportionnellement plus d'eau que de sels | Chaleur, air sec, concentration de l'appoint |
| Niveau en baisse, EC en baisse | L'absorption de nutriments est relativement forte | Stade de croissance, recette |
| EC en baisse après un appoint | L'eau ajoutée a dilué la solution | Volume ajouté |
| EC en hausse lente avec appoints réguliers | Des sels non absorbés peuvent s'accumuler | Eau de départ, renouvellement de la solution |

Avant d'ajouter de l'engrais, demandez-vous si c'est le sel ou l'eau qui a changé. Ces tendances guident une correction plus fine qu'un ajout systématique. La [composition de votre eau](/blog/qualite-eau-peut-ruiner-culture-hydroponique/) influence aussi la mesure : une eau déjà chargée occupe une partie de l'EC visée avec des éléments qui ne sont pas toujours utiles.

## Mesurer de façon fiable

- Mesurez l'eau de départ seule, puis la solution préparée.
- Relevez la valeur chaque jour à la même heure, dans une solution bien mélangée.
- Étalonnez l'appareil avec une solution de conductivité connue, au rythme indiqué par la notice.
- Rincez la sonde à l'eau distillée entre l'étalonnage et la mesure.
- Vérifiez que votre appareil corrige l'effet de la température (compensation).
- En cas de valeur inattendue, recommencez la mesure avant de corriger.

Une analyse en laboratoire reste nécessaire pour connaître chaque élément. L'EC sert à suivre l'évolution entre deux analyses, pas à les remplacer.

## « Et mon EC, dans tout ça ? » La réponse HydroGrow

**Puis-je la suivre dans le temps ?**\
C'est déjà arrivé : dans notre première version, l'EC se saisissait à la main, s'affichait en courbe et déclenchait une alerte hors plage. Le carnet de culture accueillait vos observations.

**Et sans saisie ?**\
Une sonde d'EC est prévue dans les [packs matériel](/pricing/). La température de l'eau et le niveau, eux, ont déjà été mesurés par des capteurs.

**Le dosage suivra-t-il ?**\
Le dosage automatique des nutriments est prévu à partir du Pack Confort.

**Qui décide de la cible ?**\
Vous, selon votre culture. Nous voulons que sondes, boîtier de contrôle et application vous donnent les éléments, parmi les [cinq données à surveiller](/blog/5-donnees-a-surveiller-hydroponie/).

Moins de devinettes, plus de repères : [Être informé du lancement](/contact/).
