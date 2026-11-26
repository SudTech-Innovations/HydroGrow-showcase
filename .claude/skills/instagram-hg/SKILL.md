---
name: instagram-hg
description: Lance le Studio Instagram HydroGrow (instagram/studio), s'y connecte comme assistant et attend les instructions pour créer ou modifier des posts en même temps que la personne. À utiliser avec /instagram-hg, ou dès qu'il est question de post, carrousel, story, légende, hashtags ou visuel Instagram HydroGrow.
argument-hint: "[première demande, facultative]"
---

# /instagram-hg : assister dans le Studio Instagram HydroGrow

La personne crée ses posts dans le studio (http://localhost:4400), dans son navigateur. Vous travaillez **à côté d'elle, en même temps** : vos changements apparaissent en direct chez elle (pastille verte « Claude » en haut, vignette entourée de vert, onglet Activité), et les siens ne sont jamais écrasés.

## 1. Démarrer (dès l'appel du skill)

Deux façons d'accéder au studio, au choix selon ce qui est disponible :

- **Outils MCP `studio-instagram`** (`etat_studio`, `lire_projet`, `modifier_projet`, `apercu`…) s'ils sont chargés dans la session : appelez `etat_studio`. Le serveur MCP lance le studio s'il ne tourne pas.
- **Sinon, la ligne de commande**, depuis la racine du dépôt :

  ```
  node instagram/studio/assistant.mjs demarrer
  ```

  Elle lance le studio s'il ne tourne pas (en arrière-plan, il survit à la commande), affiche la pastille « Claude · à l'écoute » et la garde tant que la session dure, puis dit ce que fait la personne.

Répondez ensuite **en deux ou trois lignes** : l'adresse du studio (à ouvrir dans son navigateur s'il ne l'est pas), ce que vous voyez (projet ouvert, diapo), et que vous attendez ses instructions. **Ne faites rien d'autre tant qu'elle n'a rien demandé**, sauf si une demande accompagne la commande (`/instagram-hg fais une story…`) : traitez-la alors directement.

Si la personne lance elle-même le studio alors qu'il tourne déjà, dites-lui qu'il est déjà ouvert sur http://localhost:4400 (un second lancement échoue, port occupé).

## 2. Pour chaque demande

1. **Situer** : `etat_studio` ou `assistant.mjs etat`. « Le post », « cette diapo » = le projet et la diapo qu'elle a ouverts.
2. **Lire** avant de modifier : `lire_projet` ou `assistant.mjs lire <projet>`. Une fois par session, `catalogue` pour les modèles et leurs champs.
3. **Modifier petit**, par opérations, avec un message court qui dit ce que vous faites :
   - MCP : `modifier_projet` ;
   - ligne de commande : écrivez un fichier JSON **avec l'outil Write** dans votre dossier temporaire (`{ "message": "…", "ops": [ … ] }`), puis `node instagram/studio/assistant.mjs ops <projet> <fichier.json>`.
   Désignez les diapos par leur `id`. Ne touchez pas au champ qu'elle est en train d'éditer (`champEnCours`).
4. **Regarder le résultat** : `apercu` ou `assistant.mjs apercu <projet> [n|planche]`, puis lisez l'image produite. Puis `verifier_projet` ou `assistant.mjs verifier <projet>`. Corrigez ce qui déborde ou sort de la charte.
5. **Rendre compte** en quelques lignes, puis attendez la suite. Un choix discutable (angle, ton, photo) se propose, il ne s'impose pas.

Nouveau post : `creer_projet`, ou `assistant.mjs creer <fichier.json>` avec `{ "titre", "format": "portrait" | "carre" | "story", "plan": "…" , "message": "…" }` (ou `"article": "<slug>"` pour partir d'un article du blog). Le plan écrit est le plus rapide : sa syntaxe est dans `EXEMPLE_PLAN` de `instagram/studio/public/auto.js`.

N'exportez les PNG (`exporter_projet`, ou le bouton du studio) que si la personne le demande. Quand elle a fini : `node instagram/studio/assistant.mjs quitter` retire la pastille (le studio reste lancé).

## Pièges

- **Accents sous Windows** : ne passez jamais de texte accentué dans `curl -d` ou en argument de commande, il est abîmé. Passez par un fichier JSON écrit avec Write (ou par les outils MCP).
- Les positions de diapos bougent après un ajout dans la même liste d'opérations : préférez les `id`.
- Le studio affiche l'activité de l'IA environ 90 secondes ; la veille la rafraîchit en « à l'écoute ».

## Charte (l'essentiel)

- Ton expert, calme, rassurant : on explique simplement, on ne dramatise jamais. Pas de capitales pour crier, pas de « !! », pas de grandes promesses.
- Mots justes : cultiver, pousser, récolter, local, frais, simple. Phrases concrètes.
- Vert pousse rare : au plus un `*accent*` court par titre.
- Titres de moins de 50 caractères, une idée par diapo, le détail va dans la légende.
- Carrousel : couverture, contenu, puis diapo « fin » avec appel à l'action (hydrogrow.fr, lien en bio ; compte @hydrogrow.app).
- Légende : accroche dans les 125 premiers caractères, 3 à 5 hashtags, texte alternatif sur chaque image.
- Le détail complet est dans `HydroGrow - Charte graphique (DA) v2.md`, l'API dans `instagram/studio/IA.md`.
