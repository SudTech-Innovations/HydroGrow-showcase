import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import editableRegions from "@cloudcannon/editable-regions/astro-integration";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// URL de production : utilisée pour les canonical, og:url, le sitemap et le flux RSS.
// À remplacer par le nom de domaine définitif quand il existe.
export default defineConfig({
  site: "https://hydro-grow-showcase.vercel.app",
  integrations: [
    react(),
    editableRegions(),
    // Pages sans valeur pour la recherche : 404, pagination du blog, pages de mots-clés
    sitemap({
      filter: (page) => !/\/404\/?$/.test(page) && !/\/tags\//.test(page) && !/\/blog\/\d+\/?$/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: true,
});
