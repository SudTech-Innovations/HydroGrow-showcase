# Inventaire des articles de blog HydroGrow

À consulter avant de créer ou de modifier un article, pour choisir son mot-clé et placer les liens internes (maillage). État au 25 novembre 2026.

## Avant de publier

1. **Un mot-clé principal par article.** Vérifier dans le tableau qu'il n'est pas déjà pris : deux articles sur le même sujet se concurrencent.
2. **Placer ce mot-clé** dans le titre, la description (`page_description`) et l'introduction ou un intertitre, sans le répéter de force.
3. **Ajouter 3 à 5 liens** vers des articles liés, dans le texte, et au moins un vers une page produit. C'est un repère maison, pas une règle de Google.
4. **Recevoir des liens** : modifier au moins 2 articles existants pour qu'ils pointent vers le nouveau.
5. **Écrire un texte de lien descriptif** (voir « Textes de lien »), jamais « cliquez ici ».
6. **Format des adresses** : `/blog/nom-du-fichier/`, avec la barre finale. Ne pas renommer un fichier publié : son adresse changerait.
7. **Mettre à jour cet inventaire** : tableau, fiche du nouvel article, lignes « Pointe vers » et « Reçoit de ».

Le bloc « À lire aussi » en bas de chaque article est automatique (mots-clés `tags` communs) : il ne remplace pas les liens dans le texte.

## Sources

- Sourcer chaque chiffre, seuil ou affirmation scientifique. Une fonction du produit n'a pas besoin de source externe, mais doit être présentée comme prévue.
- Préférer les études (avec leur DOI), les universités et les organismes publics. Ouvrir la page et vérifier qu'elle dit bien ce que le texte affirme.
- Placer le lien près de l'affirmation, avec un texte qui annonce ce qu'on va trouver.
- Ne pas élargir ce que dit la source : préciser la culture, le type de système et les conditions.
- Citer des sources fiables n'est pas pénalisé par Google ([règles sur les liens](https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=fr)).
- Un lien payé ou sponsorisé doit porter `rel="sponsored"` ou `rel="nofollow"`.

## Vue d'ensemble

| N° | Mot-clé principal | Thème | Liens reçus | Liens externes |
|---|---|---|---|---|
| A01 | [hydroponie ou culture en terre](src/content/blog/pourquoi-passer-a-l-hydroponie.md) | Découvrir | 2 | 3 |
| A02 | [capteurs hydroponie](src/content/blog/5-donnees-a-surveiller-hydroponie.md) | Pilotage | 3 | 2 |
| A03 | [pH en hydroponie](src/content/blog/ph-en-hydroponie-pourquoi-quelques-dixiemes-changent-tout.md) | Eau et nutriments | 8 | 4 |
| A04 | [EC en hydroponie](src/content/blog/ec-en-hydroponie-plus-de-nutriments-ne-veut-pas-dire-plus-de-croissance.md) | Eau et nutriments | 8 | 4 |
| A05 | [température de l'eau en hydroponie](src/content/blog/pourquoi-surveiller-temperature-eau-hydroponie.md) | Eau et nutriments | 6 | 4 |
| A06 | [qualité de l'eau en hydroponie](src/content/blog/qualite-eau-peut-ruiner-culture-hydroponique.md) | Eau et nutriments | 5 | 3 |
| A07 | [consommation d'eau en hydroponie](src/content/blog/economiser-de-leau-grace-a-lhydroponie.md) | Durabilité | 2 | 2 |
| A08 | [maladies en hydroponie](src/content/blog/hydroponie-maladies-sans-terre-risques.md) | Prévention | 4 | 3 |
| A09 | [panne de pompe en hydroponie](src/content/blog/panne-de-pompe-culture-en-danger.md) | Prévention | 4 | 2 |
| A10 | [surveillance hydroponique](src/content/blog/detecter-probleme-avant-symptomes.md) | Pilotage | 3 | 2 |
| A11 | [automatisation hydroponique](src/content/blog/automatiser-sans-perdre-controle-hydroponie.md) | Pilotage | 3 | 1 |
| A12 | [hydroponie connectée](src/content/blog/pourquoi-un-simple-minuteur-ne-suffit-plus.md) | Technologie | 2 | 1 |
| A13 | [intelligence artificielle en hydroponie](src/content/blog/comprendre-architecture-ia-nexus.md) | Technologie | 3 | 0 |
| A14 | [vision par ordinateur en hydroponie](src/content/blog/la-vision-par-ordinateur-au-service-des-plantes.md) | Technologie | 2 | 0 |

## Fiches

### A01. Hydroponie ou culture en terre : rendement, eau et énergie

- **Adresse :** `/blog/pourquoi-passer-a-l-hydroponie/`
- **Description :** Hydroponie ou pleine terre : ce que disent les études sur le rendement et l'eau, le coût en énergie et les points à maîtriser avant de se lancer.
- **Mot-clé principal :** hydroponie ou culture en terre
- **Mots-clés secondaires :** culture hors-sol, rendement hydroponique, solution nutritive, DWC, NFT
- **Faire un lien ici quand :** on définit l'hydroponie ou on la compare à la pleine terre
- **Textes de lien :** hydroponie ou culture en terre ; la culture hors-sol
- **Pointe vers :** A05, A07, A03, A04, A06 ; pages : `/features/`
- **Reçoit de :** A07, A08
- **Sources :** [l'essai comparatif de Wang et al. (2023)](https://doi.org/10.3389/fpls.2023.1165856) ; [en manquer favorise leur pourriture (University of Minnesota)](https://extension.umn.edu/how/small-scale-hydroponics) ; [comparaison sur la laitue (Barbosa et al., 2015)](https://doi.org/10.3390/ijerph120606879)

### A02. Capteurs en hydroponie : les 5 données à surveiller

- **Adresse :** `/blog/5-donnees-a-surveiller-hydroponie/`
- **Description :** pH, EC, température de l'eau, niveau et climat : les 5 données à suivre avec des capteurs pour piloter une installation hydroponique.
- **Mot-clé principal :** capteurs hydroponie
- **Mots-clés secondaires :** paramètres à surveiller, pH, EC, température de l'eau, niveau du réservoir, climat de culture, tableau de bord
- **Faire un lien ici quand :** on parle de capteurs ou de mesures en général
- **Textes de lien :** les 5 données à surveiller ; les capteurs en hydroponie
- **Pointe vers :** A03, A04, A05, A07, A09, A10 ; pages : `/pricing/`
- **Reçoit de :** A04, A05, A11
- **Sources :** [la disponibilité des nutriments (Penn State)](https://extension.psu.edu/hydroponics-systems-and-principles-of-plant-nutrition-essential-nutrients-function-deficiency-and-excess) ; [Oklahoma State University conseille un contrôle quotidien](https://extension.okstate.edu/fact-sheets/electrical-conductivity-and-ph-guide-for-hydroponics)

### A03. pH en hydroponie : pourquoi quelques dixièmes changent tout

- **Adresse :** `/blog/ph-en-hydroponie-pourquoi-quelques-dixiemes-changent-tout/`
- **Description :** pH en hydroponie : valeurs repères, causes de la dérive, effet sur les nutriments et routine de mesure pour une solution stable.
- **Mot-clé principal :** pH en hydroponie
- **Mots-clés secondaires :** acidité de la solution, dérive du pH, alcalinité, étalonnage de sonde
- **Faire un lien ici quand :** on mentionne le pH ou l'acidité
- **Textes de lien :** pH en hydroponie ; pH (acidité de l'eau)
- **Pointe vers :** A06, A04, A11 ; pages : `/pricing/`
- **Reçoit de :** A01, A02, A04, A06, A10, A12, A13, A14
- **Sources :** [Oklahoma State University recommande 5 à 6, souvent 5,5](https://extension.okstate.edu/fact-sheets/electrical-conductivity-and-ph-guide-for-hydroponics) ; [University of Minnesota 5,4 à 7](https://extension.umn.edu/how/small-scale-hydroponics) ; [Penn State 5 à 7 pour les légumes](https://extension.psu.edu/hydroponics-systems-and-principles-of-plant-nutrition-essential-nutrients-function-deficiency-and-excess) ; [Étalonnez la sonde avec des solutions de référence](https://extension.psu.edu/a-water-quality-toolkit-for-greenhouse-and-nursery-production)

### A04. EC en hydroponie : plus de nutriments, pas plus de croissance

- **Adresse :** `/blog/ec-en-hydroponie-plus-de-nutriments-ne-veut-pas-dire-plus-de-croissance/`
- **Description :** Comprendre l'EC en hydroponie : valeurs repères, risques de sous et de sur-fertilisation, et bon suivi de la solution nutritive.
- **Mot-clé principal :** EC en hydroponie
- **Mots-clés secondaires :** conductivité électrique, concentration en nutriments, sur-fertilisation, stress osmotique, mS/cm, dS/m
- **Faire un lien ici quand :** on mentionne l'EC ou le dosage des engrais
- **Textes de lien :** EC en hydroponie ; EC (concentration en nutriments)
- **Pointe vers :** A03, A06, A02 ; pages : `/features/`
- **Reçoit de :** A01, A02, A03, A06, A10, A12, A13, A14
- **Sources :** [d'une croissance ralentie ou de carences (Oklahoma State University)](https://extension.okstate.edu/fact-sheets/electrical-conductivity-and-ph-guide-for-hydroponics) ; [faire flétrir les plantes alors qu'elles sont arrosées (Penn State)](https://extension.psu.edu/hydroponics-systems-and-principles-of-plant-nutrition-essential-nutrients-function-deficiency-and-excess) ; [autour de 1,5 à 3 dS/m](https://extension.okstate.edu/fact-sheets/electrical-conductivity-and-ph-guide-for-hydroponics) ; [unité équivalente au mS/cm](https://extension.psu.edu/a-water-quality-toolkit-for-greenhouse-and-nursery-production)

### A05. Température de l'eau en hydroponie : pourquoi la surveiller ?

- **Adresse :** `/blog/pourquoi-surveiller-temperature-eau-hydroponie/`
- **Description :** Température de l'eau en hydroponie : effet sur les racines et l'oxygène dissous, repères à adapter et intérêt de la mesure continue.
- **Mot-clé principal :** température de l'eau en hydroponie
- **Mots-clés secondaires :** oxygène dissous, zone racinaire, sonde de température
- **Faire un lien ici quand :** on parle de chaleur, d'oxygène ou de santé des racines
- **Textes de lien :** température de l'eau en hydroponie ; l'oxygène dissous
- **Pointe vers :** A08, A09, A02 ; pages : `/pricing/`
- **Reçoit de :** A01, A02, A08, A09, A10, A13
- **Sources :** [plus l'eau se réchauffe, moins elle contient d'oxygène dissous (USGS)](https://www.usgs.gov/water-science-school/science/dissolved-oxygen-and-water) ; [Oklahoma State University situe l'optimum autour de 22 à 24 °C](https://extension.okstate.edu/fact-sheets/electrical-conductivity-and-ph-guide-for-hydroponics) ; [une étude sur la laitue rouge (Levine et al., 2023)](https://doi.org/10.1093/aob/mcad127) ; [certaines pourritures des racines](https://doi.org/10.1590/S0100-54052006000400001)

### A06. Qualité de l'eau en hydroponie : les points à analyser

- **Adresse :** `/blog/qualite-eau-peut-ruiner-culture-hydroponique/`
- **Description :** Qualité de l'eau en hydroponie : pH, EC, alcalinité, dureté et ions à connaître avant de préparer la solution nutritive.
- **Mot-clé principal :** qualité de l'eau en hydroponie
- **Mots-clés secondaires :** analyse d'eau, alcalinité, dureté, bicarbonates, sodium, eau de pluie
- **Faire un lien ici quand :** on parle de l'eau de départ ou de la recette nutritive
- **Textes de lien :** qualité de l'eau en hydroponie ; analyse de l'eau
- **Pointe vers :** A03, A04, A08 ; pages : `/features/`
- **Reçoit de :** A01, A03, A04, A07, A08
- **Sources :** [Penn State conseille une analyse complète en laboratoire](https://extension.psu.edu/a-water-quality-toolkit-for-greenhouse-and-nursery-production) ; [gêne l'absorption du potassium, du calcium et du magnésium](https://extension.psu.edu/hydroponics-systems-and-principles-of-plant-nutrition-essential-nutrients-function-deficiency-and-excess) ; [surveiller l'eau et, si nécessaire, la traiter](https://doi.org/10.3390/ijerph120707457)

### A07. Hydroponie et eau : quelle économie peut-on vraiment attendre ?

- **Adresse :** `/blog/economiser-de-leau-grace-a-lhydroponie/`
- **Description :** Consommation d'eau en hydroponie : ce que le circuit fermé permet d'économiser, les pertes qui restent et comment les mesurer.
- **Mot-clé principal :** consommation d'eau en hydroponie
- **Mots-clés secondaires :** économie d'eau, circuit fermé, recirculation, évaporation, bilan hydrique
- **Faire un lien ici quand :** on parle d'économie d'eau, de fuites ou de vidanges
- **Textes de lien :** consommation d'eau en hydroponie ; le circuit fermé
- **Pointe vers :** A01, A06, A09 ; pages : `/features/`
- **Reçoit de :** A01, A02
- **Sources :** [comparaison sur la laitue (Barbosa et al., 2015)](https://doi.org/10.3390/ijerph120606879) ; [Oklahoma State University estime les pertes à environ 1 à 5 % par jour](https://extension.okstate.edu/fact-sheets/principles-of-small-scale-aquaponics)

### A08. Maladies en hydroponie : sans terre, mais pas sans risques

- **Adresse :** `/blog/hydroponie-maladies-sans-terre-risques/`
- **Description :** Maladies en hydroponie : les sources de contamination qui subsistent sans sol, les signes sur les racines et les gestes de prévention.
- **Mot-clé principal :** maladies en hydroponie
- **Mots-clés secondaires :** contamination, racines brunes, hygiène, ravageurs, pathogènes
- **Faire un lien ici quand :** on parle de santé des plantes ou d'hygiène
- **Textes de lien :** maladies en hydroponie ; la prévention sanitaire
- **Pointe vers :** A01, A06, A05, A10, A14 ; pages : `/contact/`
- **Reçoit de :** A05, A06, A10, A14
- **Sources :** [une revue scientifique (Sutton et al., 2006)](https://doi.org/10.1590/S0100-54052006000400001) ; [University of Minnesota insiste sur l'hygiène et le retrait des plants malades](https://extension.umn.edu/how/small-scale-hydroponics) ; [température et l'oxygène dissous font partie des facteurs étudiés](https://doi.org/10.1590/S0100-54052006000400001)

### A09. Panne de pompe en hydroponie : quel délai avant le danger ?

- **Adresse :** `/blog/panne-de-pompe-culture-en-danger/`
- **Description :** Panne de pompe en hydroponie : ce qui détermine le délai avant danger, les risques pour les racines et comment s'y préparer.
- **Mot-clé principal :** panne de pompe en hydroponie
- **Mots-clés secondaires :** NFT, alimentation de secours, maintenance, débit, irrigation
- **Faire un lien ici quand :** on parle de pompe, de coupure ou de fiabilité
- **Textes de lien :** panne de pompe en hydroponie
- **Pointe vers :** A05, A12 ; pages : `/pricing/`
- **Reçoit de :** A02, A05, A07, A12
- **Sources :** [une coupure de courant ou une panne de pompe peut entraîner un flétrissement immédiat (Oregon State University)](https://extension.oregonstate.edu/catalog/pub/em9457) ; [eau chaude contient moins d'oxygène dissous (USGS)](https://www.usgs.gov/water-science-school/science/dissolved-oxygen-and-water)

### A10. Surveillance hydroponique : agir avant les symptômes

- **Adresse :** `/blog/detecter-probleme-avant-symptomes/`
- **Description :** Surveillance hydroponique : comment les tendances de pH, EC, niveau et température permettent d'inspecter avant les symptômes visibles.
- **Mot-clé principal :** surveillance hydroponique
- **Mots-clés secondaires :** détection précoce, alertes, tendances, anomalie, score de risque
- **Faire un lien ici quand :** on parle d'alertes ou d'anticipation
- **Textes de lien :** surveillance hydroponique ; repérer un problème avant les symptômes
- **Pointe vers :** A04, A05, A03, A08 ; pages : `/features/`
- **Reçoit de :** A02, A08, A14
- **Sources :** [vérifier le pH et l'EC chaque jour](https://extension.okstate.edu/fact-sheets/electrical-conductivity-and-ph-guide-for-hydroponics) ; [surveiller la santé des plantes](https://extension.umn.edu/how/small-scale-hydroponics)

### A11. Automatisation hydroponique : garder le contrôle

- **Adresse :** `/blog/automatiser-sans-perdre-controle-hydroponie/`
- **Description :** Automatisation hydroponique : une méthode progressive, des capteurs aux actionneurs, avec des seuils révisables et des garde-fous.
- **Mot-clé principal :** automatisation hydroponique
- **Mots-clés secondaires :** actionneurs, seuils, garde-fous, dosage, alertes
- **Faire un lien ici quand :** on parle d'automatiser une action
- **Textes de lien :** automatisation hydroponique ; des garde-fous
- **Pointe vers :** A02, A12, A13 ; pages : `/pricing/`
- **Reçoit de :** A03, A12, A13
- **Sources :** [la gestion manuelle du pH et de l'EC prend beaucoup de temps ; un suivi automatisé économise du travail et limite les erreurs (Oklahoma State University)](https://extension.okstate.edu/fact-sheets/electrical-conductivity-and-ph-guide-for-hydroponics)

### A12. Hydroponie connectée : pourquoi un minuteur ne suffit plus

- **Adresse :** `/blog/pourquoi-un-simple-minuteur-ne-suffit-plus/`
- **Description :** Hydroponie connectée : les limites du minuteur et ce qu'apportent capteurs, objets connectés et pilotage local face aux pannes.
- **Mot-clé principal :** hydroponie connectée
- **Mots-clés secondaires :** IoT, objets connectés, edge computing, mode hors ligne, Raspberry Pi, isolation galvanique, pompes péristaltiques
- **Faire un lien ici quand :** on parle d'objets connectés, de minuteur ou de fonctionnement hors ligne
- **Textes de lien :** hydroponie connectée ; les limites du minuteur
- **Pointe vers :** A09, A03, A04, A13, A11 ; pages : `/pricing/`
- **Reçoit de :** A09, A11
- **Sources :** [disponibilité des nutriments (Penn State)](https://extension.psu.edu/hydroponics-systems-and-principles-of-plant-nutrition-essential-nutrients-function-deficiency-and-excess)

### A13. IA en hydroponie : comment Nexus est conçu pour décider

- **Adresse :** `/blog/comprendre-architecture-ia-nexus/`
- **Description :** Intelligence artificielle en hydroponie : comment Pulse, Orbit et Nexus sont conçus pour surveiller, anticiper et arbitrer avec des garde-fous.
- **Mot-clé principal :** intelligence artificielle en hydroponie
- **Mots-clés secondaires :** Nexus, Pulse, Orbit, Edgia, Edge AI, score de confiance
- **Faire un lien ici quand :** on mentionne l'IA ou Nexus
- **Textes de lien :** intelligence artificielle en hydroponie ; l'IA Nexus
- **Pointe vers :** A03, A05, A04, A11, A14 ; pages : `/pricing/`
- **Reçoit de :** A11, A12, A14
- **Sources :** aucune

### A14. Vision par ordinateur en hydroponie : voir les plantes

- **Adresse :** `/blog/la-vision-par-ordinateur-au-service-des-plantes/`
- **Description :** Vision par ordinateur en hydroponie : la caméra prévue par HydroGrow pour les time-lapses et le repérage visuel du stress des plantes.
- **Mot-clé principal :** vision par ordinateur en hydroponie
- **Mots-clés secondaires :** caméra, ESP32-CAM, time-lapse, chlorose, flétrissement, score de santé
- **Faire un lien ici quand :** on parle de caméra, d'images ou de l'aspect des feuilles
- **Textes de lien :** vision par ordinateur ; la caméra de suivi
- **Pointe vers :** A03, A04, A08, A10, A13 ; pages : `/pricing/`
- **Reçoit de :** A08, A13
- **Sources :** aucune

## Pages du site à cibler

| Adresse | Faire un lien quand |
|---|---|
| `/features/` | on présente ce que la solution est conçue pour faire |
| `/pricing/` | on cite une formule, un pack ou un capteur inclus |
| `/contact/` | on invite à être informé du lancement |
| `/about/` | on parle de l'histoire du projet ou de l'équipe |
