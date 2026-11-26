---
name: studio-instagram
description: Assister la personne dans la création de posts Instagram HydroGrow avec le Studio Instagram (instagram/studio), en même temps qu'elle l'utilise. À utiliser dès qu'il est question de post, carrousel, story, légende, hashtags ou visuel Instagram HydroGrow.
---

# Assister dans le Studio Instagram HydroGrow

La personne crée ses posts dans le studio (http://localhost:4400). Vous travaillez **à côté d'elle, en même temps**, par le serveur MCP `studio-instagram` (déclaré dans `.mcp.json`). Vos changements apparaissent en direct chez elle, et les siens ne sont jamais écrasés.

## Méthode

1. **Situer** : `etat_studio` pour voir le projet ouvert, la diapo et le champ qu'elle édite. S'il est question « du post ouvert » ou « de cette diapo », c'est de là que vous partez.
2. **Comprendre** : `catalogue` (modèles, champs, opérations, charte) une fois par session, puis `lire_projet` avant toute modification.
3. **Agir petit** : `modifier_projet` avec des opérations ciblées et un `message` court qui dit ce que vous avez fait. Désignez les diapos par leur `id`. Ne touchez pas au champ qu'elle est en train d'éditer.
4. **Regarder le résultat** : `apercu` (planche, ou une diapo) et `verifier_projet`. Corrigez ce qui déborde ou sort de la charte.
5. **Rendre compte** : dites ce qui a changé. Quand un choix est discutable (ton, angle, photo), proposez-le par `envoyer_message` ou dans la conversation plutôt que de l'imposer.

Pour un nouveau post, `creer_projet` avec un `plan` écrit est le plus rapide. À partir d'un article du blog, passez par `lister_articles` puis `creer_projet` avec `article`. N'exportez (`exporter_projet`) que si la personne le demande.

Si les outils MCP ne sont pas disponibles, la même chose passe par l'API HTTP décrite dans `instagram/studio/IA.md`.

## Charte (l'essentiel)

- Ton expert, calme, rassurant : on explique simplement, on ne dramatise jamais. Pas de capitales pour crier, pas de « !! », pas de grandes promesses.
- Mots justes : cultiver, pousser, récolter, local, frais, simple. Phrases concrètes.
- Vert pousse rare : au plus un `*accent*` court par titre.
- Titres de moins de 50 caractères, une idée par diapo, le détail va dans la légende.
- Un carrousel : couverture, puis contenu, puis diapo « fin » avec appel à l'action (hydrogrow.fr, lien en bio).
- Légende : accroche dans les 125 premiers caractères, 3 à 5 hashtags, texte alternatif sur chaque image.
- Le détail complet est dans `HydroGrow - Charte graphique (DA) v2.md`.
