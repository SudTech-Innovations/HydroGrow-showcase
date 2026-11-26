# HydroGrow : site vitrine

Site de présentation d'HydroGrow, en ligne sur [hydrogrow.fr](https://hydrogrow.fr). Construit avec Astro, React et Tailwind CSS, hébergé sur Vercel.

## Développement

```bash
npm install
npm run dev
```

`npm run build` génère le site dans `dist/`.

## Contenu

| Quoi | Où |
|---|---|
| Pages (accueil, fonctionnalités, tarifs, à propos, contact) | `src/content/pages/` |
| Articles de blog | `src/content/blog/` (voir `BLOG-CONSIGNES.md`) |
| Mentions légales et confidentialité | `src/pages/` |
| Navigation, pied de page, coordonnées, FAQ | `data/` |
| Images | `public/images/` |

L'URL de production est définie dans `astro.config.mjs` et `public/robots.txt`.

## Origine

Le site est construit à partir du modèle Sendit de CloudCannon, sous licence MIT (voir `LICENSE.md`).
