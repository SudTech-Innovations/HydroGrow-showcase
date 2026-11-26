// Export en ligne de commande, sans ouvrir le studio :
//   node instagram/studio/exporter.mjs 4-mon-post        → un projet
//   node instagram/studio/exporter.mjs --tous            → tous les projets
//   node instagram/studio/exporter.mjs --prets           → ceux au statut « prêt »
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { DOSSIERS, demarrer, exporter } from "./serveur.mjs";

const args = process.argv.slice(2);
if (!args.length) {
  console.log("Usage : node instagram/studio/exporter.mjs <projet…> | --tous | --prets");
  process.exit(1);
}

let slugs = args.filter((a) => !a.startsWith("--"));
if (args.includes("--tous") || args.includes("--prets")) {
  for (const f of (await readdir(DOSSIERS.projets)).filter((f) => f.endsWith(".json"))) {
    const p = JSON.parse(await readFile(join(DOSSIERS.projets, f), "utf8"));
    if (args.includes("--tous") || p.statut === "pret") slugs.push(p.slug);
  }
}

const port = 4500 + Math.floor(Math.random() * 400);
const serveur = await demarrer(port);
let echecs = 0;
for (const slug of slugs) {
  try {
    console.log(`→ ${slug}`);
    await exporter(slug, { port, log: (f) => console.log(`  ${f}`) });
  } catch (e) {
    echecs++;
    console.error(`  échec : ${e.message}`);
  }
}
serveur.close();
process.exit(echecs ? 1 : 0);
