# Consignes de rédaction du blog HydroGrow

À lire avant d'écrire ou de modifier un article, avec [l'inventaire des articles](BLOG-INVENTAIRE.md) (mots-clés déjà pris, liens à poser, règles de maillage).

## 1. En bref

| Sujet | Règle |
|---|---|
| Lecteur | Professionnels d'abord (producteurs, fermes urbaines), puis particuliers |
| Objectif | Être trouvé sur Google en répondant à une question précise, puis orienter vers HydroGrow |
| Voix | « Nous » pour HydroGrow, « vous » pour le lecteur |
| Ton | Expert, calme, rassurant (charte) |
| Longueur | 600 à 900 mots |
| Rythme | Libre |
| Rédaction | Une IA rédige, une personne vérifie |
| Validation | Nicolas, avant toute publication |

Un article trop court se complète avec du concret (exemple, routine, limites), sans remplissage.

## 2. Choisir le sujet

- Partir d'une question qu'un producteur se pose, par exemple « Pourquoi mon pH remonte-t-il ? ».
- Choisir **un mot-clé principal** absent du tableau de l'inventaire. S'il est déjà pris, compléter l'article existant au lieu d'en créer un autre.
- Vérifier qu'on peut sourcer les points importants. Sinon, réduire le sujet.

## 3. Ton et vocabulaire

- Expliquer simplement, sans dramatiser. « Une pompe arrêtée demande une réaction rapide », pas « Votre culture va mourir ! ».
- Employer des mots concrets. La charte met en avant : cultiver, pousser, récolter, local, frais, simple.
- Parler du **local** quand le sujet s'y prête (produire près de ceux qui consomment).
- **Expliquer chaque terme technique à sa première apparition**, entre parenthèses ou dans la phrase : « l'EC (concentration en nutriments) », « NFT (un mince film d'eau le long des racines) ».
- Phrases courtes, une idée par paragraphe.
- S'adresser d'abord au professionnel, en restant compréhensible pour un débutant.

## 4. Ce qu'on ne fait pas

- Aucun chiffre, seuil ou gain sans source.
- Aucune grande promesse : ni « le meilleur », ni « le plus complet du marché », ni résultat garanti.
- HydroGrow est **en cours de développement** : écrire « est conçu pour », « prévoit » ou le futur, jamais présenter une fonction comme disponible. Cette règle vaut tant que le produit n'est pas lancé.
- Ne pas contredire la page [Tarifs](src/content/pages/pricing.md) sur le contenu des formules et des packs.
- Ne jamais annoncer de prix.
- Ne pas élargir une source : une étude sur la laitue ne vaut pas pour toutes les cultures.

## 5. Structure d'un article

1. **Introduction** (2 à 4 phrases) : la question, avec le mot-clé principal, et une première réponse.
2. **3 à 5 intertitres** de niveau 2 (`##`), qui suivent les questions du lecteur. Pas de titre de niveau 1 dans le texte : le titre de l'article l'est déjà.
3. **Du concret** : un exemple, une routine ou une liste de contrôle.
4. **Les limites** : ce qui varie selon la culture, le système ou le climat.
5. **Conclusion** : ce que HydroGrow est conçu pour apporter sur ce point (2 ou 3 phrases, pas davantage) et un lien vers une page du site.

## 6. Référencement

| Élément | Règle |
|---|---|
| Titre | 60 caractères au plus de préférence, mot-clé au début |
| Description (`page_description`) | 120 à 155 caractères, une phrase qui donne envie de lire, avec le mot-clé |
| Nom du fichier | Minuscules, sans accents, mots séparés par des tirets ; il devient l'adresse et ne change plus après publication |
| Mot-clé | Dans le titre, la description et l'introduction ou un intertitre, sans répétition forcée |
| Texte des images | Décrire ce qu'on voit, en une courte phrase |
| Liens | Suivre les règles « Avant de publier » de l'inventaire |

## 7. Sources

La règle détaillée est dans la section « Sources » de l'inventaire. En plus :

- Lien placé dans la phrase concernée, pas de liste en fin d'article.
- Un même document n'est lié qu'une fois ou deux par article.
- Si les sources divergent, donner les deux repères et leur origine.
- Si une page n'a pas pu être ouverte et lue, le signaler à Nicolas avant publication.

## 8. Fichier de l'article

Créer `src/content/blog/nom-de-l-article.md` :

```yaml
---
date: 2027-01-15
updated:
title: "Titre de l'article"
tags: ["eau", "capteurs", "guide"]
author: "Équipe HydroGrow"
thumb_image:
  image: /images/blog/nom-de-l-image.webp
  image_alt: "Ce que montre l'image"
featured_image:
  image: /images/blog/nom-de-l-image.webp
  image_alt: "Ce que montre l'image"
seo:
  page_description: "Description de 120 à 155 caractères."
  canonical_url:
  featured_image: /images/blog/nom-de-l-image.webp
  featured_image_alt: "Ce que montre l'image"
  author_twitter_handle:
  open_graph_type: article
  no_index: false
draft: true
---
```

- **Guillemets** autour du titre, de la description et des textes d'image : un « : » sans guillemets fait échouer la construction du site.
- **`draft: true`** tant que Nicolas n'a pas validé. Un brouillon n'est pas publié.
- **`date` et `updated`** : voir « Dates ».

**Image** : format WebP, 1600 × 893 pixels, dans `public/images/blog/`. Plan serré, lumière naturelle, touche bleutée dans les ombres, peu de personnes, pas de banque d'images (charte, « La photographie »).

**Mots-clés `tags`** : 3 par article, choisis de préférence dans cette liste. Ils alimentent le bloc « À lire aussi » et le menu du blog. Un nouveau mot-clé doit être ajouté à `data/blog-tag-groups.json`.

| Groupe | Mots-clés |
|---|---|
| Pilotage de la culture | capteurs, tableau de bord, alertes, données, automatisation |
| Eau et solution nutritive | eau, nutriments, racines |
| Culture et prévention | guide, prévention, maintenance, fiabilité, santé des plantes |
| Technologie | technologie, iot, innovation, intelligence artificielle, computer vision, time-lapse |
| Découvrir l'hydroponie | débutant, science, durabilité |

## 9. Dates

| Champ | Quand le remplir |
|---|---|
| `date` | Date de publication. Elle ne change plus ensuite. |
| `updated` | Date de la dernière modification de fond. Vide tant que l'article n'a pas été modifié. |

- **Une IA qui crée un article met la date du jour dans `date`** et laisse `updated` vide.
- **Une IA qui modifie un article met la date du jour dans `updated`**, sans toucher à `date`.
- Compte comme modification de fond : un texte ajouté, retiré ou corrigé sur le sens, une information, un chiffre ou une source qui change. Une faute d'orthographe, une mise en forme ou un lien interne ajouté ne comptent pas.
- Format : `AAAA-MM-JJ`, sans guillemets.
- Un brouillon modifié avant sa première publication garde `updated` vide ; mettre `date` au jour de la publication.

Quand `updated` est postérieur à `date`, la page affiche « Mis à jour le … », et cette date est transmise à Google (données de l'article et sitemap).

## 10. Rédiger avec une IA

Texte à copier, en remplaçant les crochets :

```text
Rédige un article de blog pour HydroGrow sur : [question].
Mot-clé principal : [mot-clé].
Lis d'abord BLOG-CONSIGNES.md et BLOG-INVENTAIRE.md, puis applique-les.
Pour chaque affirmation chiffrée ou scientifique, ouvre la source et vérifie
qu'elle le dit. N'invente aucune source, aucun chiffre, aucune fonction du produit.
Crée l'article en brouillon (draft: true) avec la date du jour dans date,
ajoute les liens vers lui dans au moins
deux articles existants et mets l'inventaire à jour.
Si tu modifies le fond d'un article publié, mets la date du jour dans updated.
Termine par la liste des sources lues, de celles que tu n'as pas pu ouvrir
et des points à vérifier.
```

L'IA ne publie pas : elle ne passe jamais `draft` à `false`, ne commite et ne pousse que sur demande.

Les liens ajoutés vers un brouillon mènent à une page absente tant qu'il n'est pas publié : publier l'article et les liens en même temps.

## 11. Validation avant publication (Nicolas)

- [ ] L'article répond à la question annoncée.
- [ ] Le mot-clé n'entre pas en concurrence avec un autre article.
- [ ] Les sources s'ouvrent et disent ce que le texte affirme.
- [ ] Les fonctions du produit sont exactes et présentées comme prévues.
- [ ] Les termes techniques sont expliqués.
- [ ] Titre, description, image et texte d'image sont remplis.
- [ ] Les liens internes fonctionnent, dans les deux sens.
- [ ] L'inventaire est à jour.
- [ ] `date` correspond au jour de publication ; `updated` est rempli si le fond d'un article publié a changé.
- [ ] `npm run build` réussit.
- [ ] `draft` passé à `false`.
