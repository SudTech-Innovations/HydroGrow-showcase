# Studio Instagram HydroGrow

Un outil local pour créer les publications Instagram dans la charte graphique v2 : couleurs, polices (Cal Sans, Inter), marges, cercles concentriques, logotype et ton de voix.

## Lancer

```
node instagram/studio/serveur.mjs
```

Puis ouvrir http://localhost:4400. Il faut Node 22 ou plus et Chrome (ou Edge) pour l'export. Aucune dépendance à installer.

## Avec une IA, en même temps que vous

Une IA (Claude ou une autre) peut créer, relire et modifier les posts pendant que vous travaillez. Ses changements apparaissent en direct, et les vôtres ne sont jamais écrasés. Avec Claude Code dans ce dépôt, il suffit d'accepter le serveur `studio-instagram`. Tout est expliqué dans [IA.md](IA.md).

## Trois façons de créer

| Mode | Quoi | Pour |
|---|---|---|
| **Depuis un article** (automatique) | Un article du blog devient un carrousel : couverture avec sa photo, une fiche par grande partie (6 au plus), une diapo de fin, la légende et des hashtags adaptés. | Recycler le blog en quelques secondes. |
| **Depuis un plan écrit** (semi-automatique) | Vous écrivez le fond avec quelques repères (`#`, `##`, `>`, `=`, `1.`, `"`, `!`, `[…]`), le studio choisit le modèle de chaque diapo. L'aide est dans la fenêtre. | Écrire vite sans penser mise en page. |
| **Vierge** | Carrousel, post unique ou story, à remplir modèle par modèle. | Le cas par cas. |

## Les modèles

Couverture photo · Couverture signal · Fin / appel à l'action · Fiche · Liste en cartes · Chiffre clé · Étapes · Comparaison · Citation · Écran d'app · Notifications · Photo.

Chaque modèle a quatre fonds possibles (nuit marine, bleu profond, bleu vif, brume). Le logotype change tout seul de version selon le fond, comme le veut la charte (planche 08). Dans les textes, `*mot*` met le mot en vert pousse.

Formats : post 4:5 (1080 × 1350), carré (1080 × 1080), story (1080 × 1920, avec les zones couvertes par Instagram laissées libres).

## Dans l'éditeur

- **Diapos** : glisser pour réordonner, dupliquer (Ctrl+D), supprimer, annuler (Ctrl+Z) et rétablir (Ctrl+Y).
- **Diapo** : les champs du modèle, le choix de photo (images du site ou vos propres photos, rangées dans `instagram/medias`) et le texte alternatif.
- **Légende** : rédaction automatique depuis les diapos, appels à l'action, hashtags par thème, compteur de caractères et aperçu de l'accroche.
- **Activité** : ce qu'une IA ou un autre onglet a changé, diapo par diapo.
- **Vérifier** : texte qui déborde, titre trop long, trop de vert, mots en capitales ou alarmistes, « !! », texte alternatif manquant, plus de 20 diapos, légende trop longue, trop de hashtags.
- **Zones Instagram** : montre ce qui est rogné dans la grille du profil, ou couvert par l'interface en story.

L'enregistrement est automatique.

## Où vont les fichiers

| Fichier | Contenu |
|---|---|
| `instagram/projets/<projet>.json` | Le projet (diapos, légende, statut, date prévue). |
| `instagram/<projet>/1.png, 2.png…` | Les images exportées, dans l'ordre du carrousel. |
| `instagram/<projet>/legende.md` | La légende, les hashtags et les textes alternatifs, prêts à copier. |
| `instagram/medias/` | Les photos importées. |

## Export sans ouvrir le studio

```
node instagram/studio/exporter.mjs 2-les-5-donnees
node instagram/studio/exporter.mjs --prets
node instagram/studio/exporter.mjs --tous
```

`--prets` exporte les projets au statut « Prêt ». Si Chrome n'est pas trouvé, indiquez son chemin dans la variable d'environnement `CHROME`.

## Les trois premiers posts

Les publications 1 à 3 ont été reprises dans `instagram/projets/`. Un nouvel export les redonne à l'identique, à quelques pixels près. L'ancien script `instagram/source/generer.mjs` reste en place mais n'est plus nécessaire.
