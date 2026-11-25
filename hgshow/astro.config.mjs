import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import editableRegions from "@cloudcannon/editable-regions/astro-integration";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { readdirSync, readFileSync } from "node:fs";

// Dernière modification de chaque article (champ `updated`, sinon `date`), pour le <lastmod> du sitemap
const blogDir = new URL("./src/content/blog/", import.meta.url);
const blogLastmod = new Map(
  readdirSync(blogDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const frontmatter = readFileSync(new URL(file, blogDir), "utf-8").split(/^---\s*$/m)[1] ?? "";
      const read = (key) => frontmatter.match(new RegExp(`^${key}:[ \\t]*["']?(\\d{4}-\\d{2}-\\d{2})`, "m"))?.[1];
      // Même règle que sur la page : une mise à jour antérieure à la publication est ignorée
      const dates = [read("date"), read("updated")].filter(Boolean).sort();
      return [`/blog/${file.slice(0, -3)}/`, dates.at(-1)];
    }),
);

// URL de production : utilisée pour les canonical, og:url, le sitemap et le flux RSS.
// Garder la même URL dans public/robots.txt.
export default defineConfig({
  site: "https://hydrogrow.fr",
  integrations: [
    react(),
    editableRegions(),
    // Pages sans valeur pour la recherche : 404, pagination du blog, pages de mots-clés
    sitemap({
      filter: (page) => !/\/404\/?$/.test(page) && !/\/tags\//.test(page) && !/\/blog\/\d+\/?$/.test(page),
      serialize: (item) => {
        const lastmod = blogLastmod.get(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod: new Date(lastmod).toISOString() } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: true,
});
