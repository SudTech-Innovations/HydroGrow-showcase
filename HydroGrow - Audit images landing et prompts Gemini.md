# HydroGrow · Audit des images de la landing (charte v2.0) et prompts Gemini

Référence : [HydroGrow - Charte graphique (DA) v2.md](HydroGrow - Charte graphique (DA) v2.md).
Périmètre : toutes les images affichées sur la page d'accueil (`src/content/pages/index.md`) plus les images globales (logo, favicon, bannière de partage).

## Mise à jour : images Gemini intégrées

Les images générées (`image_gemini_MASTER/`) ont été analysées puis intégrées. Les originaux restent à la racine (masters, 1 à 4 Mo) ; les versions du site sont redimensionnées en WebP (50 à 80 Ko).

| Image | Statut | Remarques restantes |
|---|---|---|
| Hero | **Intégrée** | Quasi conforme (logo HG, chiffres tous verts, cube, nav pleine largeur). Restent : léger dégradé sous la courbe de croissance, bouton en pilule au lieu de 14 px, police proche d'Inter plus que de Cal Sans |
| Feature 1 | **Intégrée** | Conforme (toggle et jauges en vert pousse, scène sombre bleutée). Format paysage au lieu de portrait |
| Feature 2 | **Intégrée** | Photo sans bandeau. Le bandeau « 82 % · +12 % » est refait en HTML (Cal Sans, vert pousse) |
| Bannière de partage | **Intégrée** | Fond Gemini (cercles, point vert) + vrai logotype tout Brume + textes en Cal Sans composés à part |

---

## Synthèse (état avant intégration)

| Image | Fichier | Verdict | Action |
|---|---|---|---|
| Hero · app sur tablette | `public/images/hero/hero-image.webp` | **Non conforme** | Régénérer (prompt 1) |
| Miniature vidéo | `public/images/video/video-thum.webp` | Conforme | Garder |
| Feature 1 · basilic + téléphone | `public/images/feature/feature-card-one.webp` | **Partiellement conforme** | Régénérer l'écran (prompt 2, optionnel mais conseillé) |
| Feature 2 · laitues + bandeau chiffres | `public/images/feature/feature-card-two.webp` | **Non conforme** (bandeau incrusté) | Régénérer la photo sans bandeau (prompt 3) |
| Feature 3 · tablette + icônes | `public/images/feature/feature-card-three.webp` | Conforme (réserve mineure) | Garder |
| Bannière de partage (OG) | `public/images/og-banner.webp` | **Non conforme** | Refaire (prompt 4) |
| Logotype horizontal | `public/images/logo-horizontal.svg` | Conforme après correction | Écart icône–texte passé à 2x (fait) |
| Icône / favicon | `public/images/logo-icon.svg`, `favicon.png`, `favicon.ico` | Conforme | Garder |

Les couleurs relevées sur les images sont des échantillons de pixels, à lire comme des ordres de grandeur.

---

## 1. Hero · `hero-image.webp` : non conforme

**Ce qui va :** fond nuit marine, cartes bleu profond, bouton vert pousse avec texte nuit marine, badge « Optimal », cercles concentriques bleu pixel, textes en français, ton calme (« Votre jardin va bien aujourd'hui. »).

**Ce qui ne va pas :**
1. **Logo d'en-tête faux.** Quatre petits points en cercle, alors que la charte demande le symbole seul (H en points + feuille). La marque n'est pas reconnaissable.
2. **Typographie.** Les titres et les chiffres clés (« Bonjour, Léa », 6,0, 82 %, 22 °C, +12 %) sont en sans-serif générique. La charte demande Cal Sans.
3. **Couleurs des chiffres incohérentes.** 6,0 en vert, 82 % en bleu vif (#152F62 environ), 22 °C en blanc. En v2 les chiffres clés sont tous en vert pousse.
4. **Dégradé décoratif.** Le graphique « Croissance » a un remplissage en dégradé sous la courbe. Interdit : « aucun dégradé décoratif ».
5. **Icône Stock.** Un panier, alors que la charte donne un cube.
6. **Cercles déformés.** Plusieurs cercles se chevauchent en ellipses. Ils doivent être concentriques et parfaitement ronds.
7. **Composition.** Les cartes occupent la moitié gauche, la barre de navigation est tronquée (elle s'arrête avant le bord droit) et la moitié droite est vide.
8. **Rayons.** À aligner sur 14 px (boutons), 20 px (cartes).

**Prompt Gemini 1 (à lancer avec le format 16:9, 1600 × 893 px minimum)**

```
Crée une maquette d'application mobile premium, vue de face, posée sur une tablette moderne noire en orientation paysage (cadre fin, coins arrondis, sans reflet), sur un fond uni bleu nuit #08172B. Style : interface sombre, épurée, aplats, AUCUN dégradé, aucune ombre portée décorative.

Palette stricte : fond d'écran #08172B, cartes #12305A, texte principal #EAF3EE, accent et chiffres clés #5BE3A8, points secondaires #2D5083. Aucune autre couleur.
Typographie : titres et chiffres clés en Cal Sans (géométrique, arrondie, graisse unique) ; textes courants en Inter. Tous les chiffres clés sont en vert #5BE3A8.

Contenu de l'écran, aligné sur une grille propre, marges de 24 px :
- En haut à gauche : l'icône HydroGrow seule, c'est-à-dire un H dessiné en gros points blancs ronds (grille de 4 colonnes sur 5 lignes, la barre du H est la ligne centrale), complété par de petits points bleu #2D5083 sur les autres cases, avec une seule petite feuille verte à deux tons (vert clair #5BE3A8 en haut, vert plus profond #3DBE8A en bas, séparés par une nervure) posée en haut à gauche du H. Le tout dans une tuile carrée bleu profond #12305A aux coins très arrondis. En haut à droite : un avatar rond bleu profond avec la lettre « L » en vert.
- Titre en Cal Sans : « Bonjour, Léa ». Sous-titre en Inter : « Votre jardin va bien aujourd'hui. »
- Carte « Parcelle · Basilic » (coins arrondis 20 px) avec une pastille verte « Optimal » et trois mesures côte à côte, chiffres en Cal Sans vert #5BE3A8 : « 6,0 » légende « pH » ; « 82 % » légende « Eau » ; « 22 °C » légende « Air ».
- Carte « Croissance · 30 jours » avec « +12 % » en vert et une courbe de croissance fine verte, sans remplissage ni dégradé sous la courbe.
- Bouton large vert #5BE3A8, coins arrondis 14 px, texte nuit marine #08172B : « Lancer le dosage de nutriments ».
- Barre de navigation en bas, sur toute la largeur de l'écran : Jardin (actif, en vert), Stock, Communauté, Profil. Icônes au trait arrondi fin (environ 1,8 px), style outline : une pousse, un cube, deux personnes, un profil. Icônes inactives en #EAF3EE.

Décor derrière l'écran, sur la droite de l'image : des cercles concentriques fins (trait 1,5 px, couleur #2D5083), parfaitement ronds et centrés sur UN point vert #5BE3A8 d'environ 28 px de diamètre. Pas d'ellipses, pas de chevauchement.

Interdit : dégradés, ombres colorées, photos, texte en anglais, logos autres que celui décrit, polices à empattements.
```

---

## 2. Feature 1 · `feature-card-one.webp` : partiellement conforme

**Ce qui va :** photographie sombre à touche froide et bleutée, plan serré sur le basilic et les racines, lumière douce, une seule main (peu de personnes), pas de photo de banque d'images. Écran bleu profond avec toggle et jauges.

**Ce qui ne va pas :**
- Le vert des jauges et du toggle (#60E87D environ) est plus jaune que le vert pousse (#5BE3A8, plus bleuté). Il est reconnaissable à l'œil à côté du site.
- Typographie de l'écran (« pH », « EC », « Mode automatique ») en sans-serif générique, pas en Cal Sans / Inter.
- Jauges avec un rendu 3D discret, alors que la charte demande des aplats.

Le reste fonctionne : cette image peut rester en attendant. Si vous la refaites :

**Prompt Gemini 2 (portrait 1300 × 1400 px)**

```
Photographie éditoriale, plan serré, lumière naturelle douce venant d'une fenêtre à gauche, ambiance sombre et calme avec une touche froide bleutée dans les ombres. Un plant de basilic en hydroponie : panier de culture noir posé sur un bac d'eau sombre, racines blanches fines qui plongent dans l'eau claire. Profondeur de champ faible, arrière-plan flou bleu nuit (#08172B à #12305A). Pas de mobilier décoratif, pas de logo.

Au premier plan à gauche, une main (sans bague, peau naturelle) tient un smartphone moderne en mode portrait, légèrement incliné. L'écran affiche une interface sombre en aplats :
- fond #08172B, carte #12305A avec deux jauges circulaires fines ouvertes, trait arrondi vert #5BE3A8, aux étiquettes « pH » et « EC » en Cal Sans (blanc cassé #EAF3EE) ;
- en dessous, une ligne « Mode automatique » en Inter avec un interrupteur actif vert #5BE3A8 (rond sombre à droite).
Aucun dégradé, aucun effet 3D, aucune lueur sur l'écran, aucune autre couleur que #08172B, #12305A, #EAF3EE, #5BE3A8.

Style photo : réaliste, grain très léger, couleurs naturelles pour le végétal (vert profond), dominante bleu nuit dans l'environnement. Pas de photo de banque d'images, pas de fond blanc, une seule main visible, aucun visage.
```

---

## 3. Feature 2 · `feature-card-two.webp` : non conforme (bandeau incrusté)

**Ce qui va :** la photo elle-même (laitues et jeunes pousses dans un bac noir, sonde de pH, fond bleu nuit, lumière douce, plan serré).

**Ce qui ne va pas :**
1. **Le bandeau « 82 % · +12 % » est incrusté dans l'image.** Chiffres en Brume et non en vert pousse, police générique au lieu de Cal Sans, aucune légende (82 % de quoi ?), et le texte ne peut plus être traduit, modifié ni rendu net sur écran Retina.
2. Le bandeau est posé à plat sur la photo, avec une courbe verte sans lien avec le reste de l'image.

**Recommandation :** régénérer la photo sans bandeau, et recréer le bandeau en code HTML/CSS par-dessus (Cal Sans, vert pousse, légendes « Eau » et « Croissance · 30 jours »). Je peux le faire dès que la photo est disponible. Gemini est peu fiable sur le texte et les polices : ne pas lui demander d'incruster du texte.

**Prompt Gemini 3 (portrait 1300 × 1400 px)**

```
Photographie éditoriale, plan serré, lumière naturelle douce et calme, ambiance sombre avec une touche froide bleutée dans les ombres. Un bac hydroponique noir mat rempli de laitues vert clair, de jeunes pousses de laitue et d'aromates, avec un tube d'irrigation fin gris et une sonde de pH noire plongée dans l'eau claire. Légère diagonale de composition, premier plan net sur les laitues, arrière-plan flou bleu nuit (#08172B à #12305A).

IMPORTANT : le tiers inférieur de l'image doit rester calme et sombre, sans objet ni texte, pour accueillir plus tard une carte d'interface. Aucun texte, aucun chiffre, aucune interface, aucun logo, aucune personne dans l'image.

Style photo : réaliste, grain très léger, végétal d'un vert vif mais naturel, dominante bleu nuit dans l'environnement. Pas de photo de banque d'images, pas de fond blanc.
```

---

## 4. Feature 3 · `feature-card-three.webp` : conforme

Photographie en plan serré de tomates, laitue et basilic en hydroponie, avec une tablette dont l'écran reprend les icônes de la charte (pousse, goutte, soleil, courbe de croissance) en vert pousse sur des tuiles bleu profond arrondies. Les couleurs relevées sur l'écran (#123055 pour les tuiles) correspondent à bleu profond.

**Réserve mineure :** une bande de lumière chaude (rideau beige et bois orangé) sur le bord gauche casse un peu la dominante bleutée. À corriger seulement lors d'une prochaine refonte. Aucune action nécessaire.

---

## 5. Bannière de partage · `og-banner.webp` : non conforme

**Ce qui va :** la promesse « L'avenir est local. », le sous-titre, la pastille « Planter. Connecter. Savourer. » (vert pousse, texte nuit marine), le point vert au centre des cercles.

**Ce qui ne va pas :**
1. **Logotype faux.** « HydroGrow » avec deux majuscules, en sans-serif bold générique, sans l'icône. Le logotype officiel est le symbole (H en points + feuille, dans sa tuile) suivi de « hydrogrow » en minuscules, en Cal Sans.
2. **Règle sur « grow » non respectée.** Sur fond bleu vif, le logotype doit être tout en Brume : « grow » en vert pousse est réservé aux fonds sombres.
3. **Cercles trop épais et trop foncés.** Traits de 3 px environ en bleu marine (#1D4B8B), alors que la charte demande des cercles fins en bleu pixel.
4. **Titres en sans-serif générique** au lieu de Cal Sans.
5. Fond #1976F4 : proche mais légèrement décalé du bleu vif #1F6FEB.

**Remarque :** une bannière doit contenir le vrai logo et le vrai texte, que Gemini ne sait pas reproduire fidèlement. La meilleure solution est de demander à Gemini uniquement le **fond**, puis d'ajouter le logotype (`public/images/logo-horizontal.svg`, version Brume sur bleu vif) et les textes en Cal Sans dans Figma. Pour un test rapide, le prompt ci-dessous demande aussi le texte, mais il faudra vérifier le rendu.

**Prompt Gemini 4a : fond seul (recommandé), 1200 × 630 px**

```
Image de fond plate, format 1200 × 630 px, fond uni bleu vif #1F6FEB, sans aucun dégradé ni texture. Sur la partie droite : des cercles concentriques très fins (trait 1,5 px), de couleur #EAF3EE à 35 % d'opacité, parfaitement ronds et exactement centrés sur un point vert #5BE3A8 plein de 36 px de diamètre. Les cercles sont coupés par le bord droit de l'image, comme un signal qui se propage. Cinq cercles, espacés régulièrement. Rien d'autre : pas de texte, pas de logo, pas d'ombre, pas de dégradé. Le côté gauche (60 % de la largeur) est complètement vide et uni.
```

**Prompt Gemini 4b : bannière complète (à vérifier)**

```
Bannière de partage 1200 × 630 px, style minimaliste premium, aplats uniquement, aucun dégradé. Fond bleu vif #1F6FEB.

En haut à gauche : le logotype « hydrogrow » en minuscules, police Cal Sans, tout en blanc cassé #EAF3EE, précédé d'une petite icône carrée aux coins très arrondis, bleu profond #12305A, contenant un H dessiné en gros points blancs ronds (4 colonnes × 5 lignes) avec de petits points bleus #2D5083 sur les autres cases et une petite feuille verte (#5BE3A8 en haut, #3DBE8A en bas) en haut à gauche du H.

Au centre à gauche : titre en Cal Sans, blanc cassé #EAF3EE, sur deux lignes : « L'avenir est local. » Sous-titre en Inter : « Cultivez-le avec HydroGrow. » Dessous, une pastille arrondie vert #5BE3A8 avec le texte nuit marine #08172B en Inter semi-gras : « Planter. Connecter. Savourer. »

À droite : cercles concentriques fins (trait 1,5 px, #EAF3EE à 35 %), parfaitement ronds, centrés sur un point vert #5BE3A8 plein, coupés par le bord de l'image.

Interdit : dégradés, ombres, autres couleurs, majuscules dans « hydrogrow », « grow » en vert (le logotype est tout en blanc cassé sur fond bleu), photos.
```

---

## Images conformes : détails

### Miniature vidéo · `video-thum.webp`
Basilic dans un verre d'eau, racines blanches en bas, fond bleu nuit, plan serré, lumière douce, peu de personnes (aucune) : respecte la section photographie de la charte. Image extraite de la vidéo (`videos/hydrogrow-presentation.mp4`), donc un peu douce et recadrée en haut. Elle reste cohérente avec la vidéo : à garder. Si la vidéo est refaite, extraire une nouvelle image dans la même ambiance (plan serré, dominante bleu nuit, pas de décor).

### Logotype, icône, favicon
- `logo-horizontal.svg` : icône en tuile bleu profond (rayon 1,8x), H en points brume, trame bleu pixel, feuille deux tons, « hydro » en Brume et « grow » en vert pousse (fond sombre uniquement). **Corrigé** : l'écart icône–texte était de 1,4x, il est maintenant de 2x comme demandé par la planche 06.
- `logo-icon.svg`, `favicon.png`, `favicon.ico` : conformes à l'icône principale (fond sombre).

## Autres images du dépôt, hors landing

Non auditées, mais à connaître :
- `public/images/logo.svg` et `public/images/footer-logo.svg` : anciens logos du gabarit d'origine (couleurs `#1d1d1b` et `#134c4b`), non utilisés dans le code. À supprimer pour éviter une réutilisation par erreur.
- Les images des pages À propos, Fonctionnalités, Blog et Équipe (`public/images/about`, `feature-hero*.webp`, `blog/*`, `team/*`) ne sont pas dans cette passe. Je peux les auditer de la même façon si vous le souhaitez.
- Versions du logotype pour fond clair et fond bleu vif (planche 08) : pas encore présentes en SVG dans le dépôt, pas utilisées aujourd'hui car tout le site est sur fond sombre.

---

# Audit complet : images des autres pages

## Synthèse

| Groupe | Fichiers | Verdict | Action |
|---|---|---|---|
| Miniature vidéo, feature 3, favicon | voir plus haut | Conformes | Aucune |
| Page Fonctionnalités | `feature-hero`, `feature-card-four`, `-five`, `-six` | Conformes (réserves mineures) | Aucune obligatoire |
| Page À propos | `aboutfeature-two`, `-three`, `-four`, `works/banner` | Conformes | Aucune |
| Équipe | `team/*.webp` (10) | Acceptables | Optionnel (lumière chaude) |
| **Blog** | `blog/hydroponie-*.png` (10) | **Non conformes pour 8 sur 10** | Régénérer (prompt 5) |
| **Page 404** | `404/error.png` | **Non conforme** | Régénérer (prompt 6) |

## Détail

### Fonctionnalités et À propos : conformes
Dominante bleu nuit, plans serrés sur les plantes, aucun fond blanc, pas de banque d'images. Les écrans de téléphone et de tablette utilisent des tuiles bleu profond et des éléments verts. Réserves mineures :
- `feature-card-six` : le mot « Optimal » est tourné et petit, et la jauge « 92 » n'existe pas dans la charte (jauge bleu vif pour le niveau d'eau). À refaire seulement si vous voulez un contrôle strict.
- `feature-hero` : plan large de serre, moins « serré » que la charte, mais bien dans les teintes.
- `aboutfeature-four` : trois personnes de dos ou de profil, c'est la limite du « peu de personnes ».

### Équipe : acceptables
Silhouettes sombres, cohérentes entre elles. Éclairage chaud (lampes jaunes) sur plusieurs portraits, alors que la charte demande une touche froide bleutée dans les ombres. Pas bloquant. Ce sont aussi des images générées : à remplacer par de vraies photos de l'équipe si elles existent.

### Blog : non conformes (8 sur 10)
Presque toutes sont des vues lumineuses de serre ou de laboratoire, avec fond blanc ou très clair, verts très saturés, eau turquoise, ambiance banque d'images. La charte dit : lumière naturelle mais dominante bleu nuit, jamais de photo de banque d'images sur fond blanc.

| Image | Problème |
|---|---|
| `temperature` | Fond blanc et flou clair, pas de dominante bleu nuit |
| `qualite-eau` | Fond blanc, verre sur paillasse, style banque d'images |
| `pompe` | Tons chauds (rose, orange), serre claire |
| `ph` | Plutôt sombre et moody : **acceptable** |
| `maladies` | Fond blanc, tube blanc brillant |
| `ec` | Fond blanc, eau turquoise vif |
| `eau` | Bleutée, assez sombre : **acceptable** |
| `donnees` | Bleu nuit mais écran multicolore (violet, orange, rouge) : hors palette |
| `detection` | Fond blanc fondu, ordinateur portable |
| `automatisation` | Contre-jour doré chaud, serre claire |

### Page 404 : non conforme
Illustration de gabarit en dessin animé : manche jaune, « 404 » lilas, fond noir. Aucune de ces couleurs ne fait partie de la palette, et le style (dessin animé) n'est pas celui de la marque. À remplacer.

---

## Prompts Gemini

### Prompt 5 : images du blog (format 16:9, 1672 × 941 px)

Même gabarit pour les 10 images, seul le sujet change. Remplacer `[SUJET]` par la ligne correspondante, et garder le reste identique pour que la série soit cohérente.

```
Photographie éditoriale, format paysage 16:9, plan serré, lumière naturelle douce et calme. Ambiance sombre et premium : dominante bleu nuit (#08172B à #12305A) dans l'arrière-plan et les ombres, avec une touche froide bleutée. Le végétal reste d'un vert naturel et profond, jamais fluo. Matériel hydroponique noir mat ou gris anthracite. Profondeur de champ faible, arrière-plan flou bleu nuit.

Sujet : [SUJET]

Interdit : fond blanc ou très clair, ciel blanc, serre inondée de lumière, couleurs saturées, eau turquoise, tons chauds ou dorés, style banque d'images, logos, texte, personnes visibles (une main est tolérée). Aucun écran multicolore : les éventuels écrans sont sombres (#08172B), avec des éléments vert #5BE3A8 et des tuiles bleu profond #12305A uniquement.
```

Sujets à insérer :

| Fichier | Article | `[SUJET]` |
|---|---|---|
| `hydroponie-temperature.png` | Température de l'eau | Racines blanches de laitue plongeant dans un bac d'eau claire, avec une sonde de température inox fine plongée dans l'eau |
| `hydroponie-qualite-eau.png` | Qualité de l'eau | Verre d'eau claire posé sur un plan de travail sombre, à côté d'un bac hydroponique noir où des laitues poussent |
| `hydroponie-pompe.png` | Panne de pompe | Petite pompe immergée noire dans un bac d'eau avec bulles, câble d'alimentation, laitues au-dessus. Voyant rouge discret |
| `hydroponie-ph.png` | pH | Testeur de pH numérique blanc et noir plongé dans l'eau d'un bac, écran affichant « 5,8 », racines claires à côté |
| `hydroponie-maladies.png` | Maladies | Coupe transparente d'un tube de culture noir montrant des racines saines, avec une racine légèrement brunie au centre |
| `hydroponie-ec.png` | EC | Sonde de conductivité (EC) noire plongée dans un canal d'eau sombre, laitues en fond flou |
| `hydroponie-eau.png` | Économie d'eau | Circuit fermé d'eau : tuyaux noirs, léger écoulement dans un bac sombre, laitues sur le côté |
| `hydroponie-donnees.png` | 5 données à surveiller | Tablette posée sur un bac hydroponique, écran sombre avec quatre tuiles bleu profond et des icônes vertes (goutte, soleil, courbe, feuille) |
| `hydroponie-detection.png` | Détecter avant les symptômes | Petite caméra noire fixée au-dessus d'un bac de laitues, avec un seul voyant vert, vue serrée |
| `hydroponie-automatisation.png` | Automatiser | Boîtier de dosage noir et petites bouteilles de nutriments sur un mur sombre, tubes fins vers un bac de laitues |

### Prompt 6 : page 404 (format 5:4, fond transparent ou nuit marine)

```
Illustration minimaliste, aplats uniquement, aucun dégradé, aucune ombre. Fond uni nuit marine #08172B.

Au centre : le nombre « 404 » en Cal Sans (géométrique, arrondie, graisse unique), en blanc cassé #EAF3EE. Le « 0 » est remplacé par un point vert plein #5BE3A8 entouré de cercles concentriques fins (trait 1,5 px, couleur #2D5083), comme un signal qui se propage et ne trouve rien. Autour, une petite trame de points : gros points blancs #EAF3EE, petits points bleus #2D5083, répartis régulièrement dans les angles.

Palette stricte : #08172B, #12305A, #EAF3EE, #5BE3A8, #2D5083. Aucune autre couleur.

Interdit : personnages, mains, manches, dessin animé, jaune, violet, lilas, dégradés, ombres, texte autre que « 404 ».
```

*Variante plus fiable :* demander à Gemini seulement le décor (cercles et point vert, sans « 404 ») et ajouter le texte en code, comme pour la bannière de partage. Je peux le faire.

---

## Hors images photo

- `contact/*.svg`, `pricing/Vector1.svg`, `about/arrow-down.svg` : pictogrammes de gabarit en gris `#4d4d4d`. Ils ne s'affichent plus (remplacés par des icônes Phosphor), mais ils sont hors palette : à supprimer.
- `testimonial/*` : utilisés seulement dans du code commenté (témoignages désactivés).
