// Serveur MCP du Studio Instagram HydroGrow (stdio, sans dépendance).
// Permet à une IA (Claude Code, Claude Desktop ou tout client MCP) de créer et modifier des
// posts dans le studio pendant que vous l'utilisez : chaque changement apparaît en direct dans
// votre navigateur, et vos modifications ne sont jamais écrasées.
//
//   node instagram/studio/mcp.mjs
//
// Variables : STUDIO_URL (par défaut http://127.0.0.1:4400), STUDIO_IA_NOM (par défaut « Claude »).
// Si le studio ne tourne pas, ce serveur le démarre lui-même.
import { createInterface } from "node:readline";

const URL_STUDIO = (process.env.STUDIO_URL ?? "http://127.0.0.1:4400").replace(/\/$/, "");
const NOM = process.env.STUDIO_IA_NOM ?? "Claude";

// ---------- Connexion au studio ----------

let pret;
function studio() {
  pret ??= (async () => {
    try {
      await fetch(`${URL_STUDIO}/api/presence`);
    } catch {
      const { demarrer } = await import("./serveur.mjs");
      await demarrer(Number(new URL(URL_STUDIO).port || 4400));
      process.stderr.write(`Studio démarré sur ${URL_STUDIO}\n`);
    }
  })();
  return pret;
}

async function api(chemin, { methode = "GET", corps, brut = false } = {}) {
  await studio();
  const r = await fetch(`${URL_STUDIO}/api/${chemin}`, {
    method: methode,
    headers: corps ? { "content-type": "application/json" } : {},
    body: corps ? JSON.stringify(corps) : undefined,
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e.erreur ?? `Erreur ${r.status} sur ${chemin}`);
  }
  return brut ? Buffer.from(await r.arrayBuffer()) : r.json();
}

// Présence : l'IA apparaît dans la barre du studio, avec ce qu'elle fait
let dernierAppel = 0;
let presence = { projet: null, diapo: null };
async function signaler(activite, projet = presence.projet, diapo = presence.diapo) {
  presence = { projet, diapo };
  dernierAppel = Date.now();
  await api("presence", { methode: "POST", corps: { qui: NOM, ia: true, activite, projet, diapo } }).catch(() => {});
}
setInterval(() => {
  if (!pret) return;
  const inactif = Date.now() - dernierAppel > 60_000;
  api("presence", { methode: "POST", corps: { qui: NOM, ia: true, activite: inactif ? "" : undefined, ...presence } }).catch(() => {});
}, 40_000).unref();

// ---------- Outils ----------

const texte = (t) => ({ content: [{ type: "text", text: typeof t === "string" ? t : JSON.stringify(t, null, 2) }] });

const resumeProjet = (p) => ({
  projet: p.slug,
  version: p.version,
  titre: p.titre,
  format: p.format,
  pied: p.pied,
  statut: p.statut,
  date: p.date,
  legende: p.legende,
  diapos: p.diapos.map((d, i) => ({ n: i + 1, id: d.id, modele: d.modele, champs: d.champs, alt: d.alt })),
});

async function humainSur(slug) {
  const h = (await api("presence")).find((p) => p.qui === "humain");
  if (!h) return "La personne n'a pas le studio ouvert en ce moment.";
  if (h.projet !== slug) return h.projet ? `La personne travaille sur un autre projet (« ${h.projet} »).` : "La personne est sur l'accueil du studio.";
  return `La personne a ce projet ouvert : diapo ${h.numero ?? "?"} (id ${h.diapo}), onglet « ${h.onglet} »${h.champ ? `, en train d'éditer le champ « ${h.champ} »` : ""}. Évitez de modifier ce champ en même temps.`;
}

const OPERATIONS_DOC = `Liste d'opérations appliquées dans l'ordre, sur la dernière version (rien n'est écrasé chez l'humain).
Une diapo se désigne par son id (stable, conseillé) ou par sa position (1 = première ; attention, les positions bougent après un ajout).
- { "op": "projet", "champ": "titre"|"format"|"pied"|"statut"|"date"|"site", "valeur": … }   format : portrait|carre|story ; pied : pagination|site|logo|aucun ; statut : idee|brouillon|pret|publie ; date : AAAA-MM-JJ
- { "op": "legende", "valeur": "texte de la légende, sans hashtags" }
- { "op": "hashtags", "valeur": ["hydroponie", "HydroGrow"] }   (3 à 5 conseillés)
- { "op": "champ", "diapo": id, "champ": "titre", "valeur": "…" }
- { "op": "champs", "diapo": id, "valeurs": { "titre": "…", "texte": "…" } }
- { "op": "alt", "diapo": id, "valeur": "texte alternatif" }
- { "op": "modele", "diapo": id, "modele": "fiche", "champs": {…} }   (les champs communs sont gardés)
- { "op": "ajouter", "apres": id | 0, "modele": "fiche", "champs": {…}, "alt": "…" }   (apres absent = à la fin, 0 = en tête)
- { "op": "plan", "apres": id | 0, "texte": "plan écrit" }   (même syntaxe que creer_projet.plan)
- { "op": "supprimer", "diapo": id }
- { "op": "deplacer", "diapo": id, "apres": id | 0 }
- { "op": "ordre", "ids": [id, id, …] }`;

const PLAN_DOC = `Plan écrit : un bloc par diapo, blocs séparés par une ligne « --- ».
# Titre → couverture (photo si une ligne « @ /images/… » est présente) · ## Titre → fiche (cartes : « - Étiquette | texte », icône : « icone: ph ») · > Texte → sur-titre · = 82 | % → chiffre clé (ligne suivante = titre) · 1. Titre | détail → étapes · " Citation puis — Auteur → citation · ! Titre → diapo de fin · [Texte] → pastille verte · *mot* → accent vert pousse.`;

const OUTILS = [
  {
    name: "etat_studio",
    description: "Ce que la personne fait dans le studio (projet ouvert, diapo, champ en cours d'édition) et la liste des projets. À appeler en premier pour savoir où aider.",
    inputSchema: { type: "object", properties: {} },
    async run() {
      const [presences, projets] = await Promise.all([api("presence"), api("projets")]);
      const h = presences.find((p) => p.qui === "humain");
      return texte({
        studio: URL_STUDIO,
        personne: h ? { projet: h.projet, diapo: h.numero, diapoId: h.diapo, onglet: h.onglet, champ: h.champ } : "studio fermé dans le navigateur",
        autresIA: presences.filter((p) => p.ia && p.qui !== NOM).map((p) => ({ qui: p.qui, projet: p.projet, activite: p.activite })),
        projets: projets.map(({ slug, titre, statut, date, format, diapos }) => ({ projet: slug, titre, statut, date, format, diapos })),
      });
    },
  },
  {
    name: "catalogue",
    description: "Les modèles de diapos (champs, types, options, valeurs par défaut), les fonds, formats et icônes, la syntaxe du plan écrit, les opérations possibles et les règles de la charte HydroGrow. À lire avant de créer ou modifier.",
    inputSchema: { type: "object", properties: {} },
    async run() {
      return texte({ ...(await api("modeles")), planEcrit: PLAN_DOC, operations: OPERATIONS_DOC, charte: CHARTE });
    },
  },
  {
    name: "lire_projet",
    description: "Contenu complet d'un projet : réglages, légende, hashtags et diapos (numéro, id, modèle, champs, texte alternatif), plus où en est la personne dans ce projet.",
    inputSchema: { type: "object", properties: { projet: { type: "string", description: "Identifiant du projet, ex. 2-les-5-donnees" } }, required: ["projet"] },
    async run({ projet }) {
      await signaler("lit le projet", projet, null);
      const p = await api(`projets/${projet}`);
      return texte({ ...resumeProjet(p), personne: await humainSur(projet) });
    },
  },
  {
    name: "creer_projet",
    description: `Crée un projet de post. Donnez soit un « plan » écrit (le plus simple), soit un « article » du blog (slug, voir lister_articles), soit une liste de « diapos » ({ modele, champs, alt }), soit rien (couverture + fin). Le projet apparaît chez la personne avec un bouton pour l'ouvrir. ${PLAN_DOC}`,
    inputSchema: {
      type: "object",
      properties: {
        titre: { type: "string" },
        format: { type: "string", enum: ["portrait", "carre", "story"] },
        plan: { type: "string" },
        article: { type: "string" },
        diapos: { type: "array", items: { type: "object", properties: { modele: { type: "string" }, champs: { type: "object" }, alt: { type: "string" } }, required: ["modele"] } },
        legende: { type: "object", properties: { texte: { type: "string" }, hashtags: { type: "array", items: { type: "string" } } } },
        date: { type: "string", description: "Date de publication prévue, AAAA-MM-JJ" },
        statut: { type: "string", enum: ["idee", "brouillon", "pret"] },
        message: { type: "string", description: "Mot affiché à la personne" },
      },
    },
    async run(a) {
      await signaler(`crée « ${a.titre ?? "un projet"} »`, null, null);
      const p = await api("projets", { methode: "POST", corps: { ...a, auteur: NOM } });
      if (a.message) await api("evenements", { methode: "POST", corps: { auteur: NOM, texte: a.message, projet: p.slug } });
      presence = { projet: p.slug, diapo: null };
      return texte({ cree: p.slug, ...resumeProjet(p) });
    },
  },
  {
    name: "modifier_projet",
    description: `Modifie un projet par opérations, en même temps que la personne : ses changements en cours sont conservés et les vôtres apparaissent en direct chez elle. Donnez toujours un « message » court qui dit ce que vous avez fait. ${OPERATIONS_DOC}`,
    inputSchema: {
      type: "object",
      properties: {
        projet: { type: "string" },
        operations: { type: "array", items: { type: "object" } },
        message: { type: "string", description: "Ce que vous avez changé, en une phrase (affiché à la personne)" },
      },
      required: ["projet", "operations", "message"],
    },
    async run({ projet, operations, message }) {
      const cible = operations.find((o) => o.diapo != null)?.diapo ?? null;
      const avant = await api(`projets/${projet}`);
      const diapoId = typeof cible === "number" ? avant.diapos[cible - 1]?.id : cible;
      await signaler(message, projet, diapoId ?? null);
      const r = await api(`projets/${projet}/operations`, { methode: "POST", corps: { ops: operations, auteur: NOM, message, source: `mcp-${NOM}` } });
      return texte({ ...(r.erreurs?.length ? { erreurs: r.erreurs } : {}), ...resumeProjet(r.projet) });
    },
  },
  {
    name: "apercu",
    description: "Image PNG du rendu réel : une diapo (numéro) ou la planche de toutes les diapos (par défaut, cadre rouge = texte qui déborde). Servez-vous-en pour juger la mise en page avant de proposer.",
    inputSchema: {
      type: "object",
      properties: { projet: { type: "string" }, diapo: { type: "integer", description: "Numéro de la diapo (1 = première). Absent = planche complète." }, echelle: { type: "number", description: "0.25 à 1 ; 0.5 par défaut pour une diapo seule" } },
      required: ["projet"],
    },
    async run({ projet, diapo, echelle }) {
      await signaler(diapo ? `regarde la diapo ${diapo}` : "regarde le carrousel", projet, null);
      const png = await api(`projets/${projet}/apercu?diapo=${diapo ?? "planche"}&echelle=${echelle ?? (diapo ? 0.5 : 1)}`, { brut: true });
      return { content: [{ type: "image", data: png.toString("base64"), mimeType: "image/png" }] };
    },
  },
  {
    name: "verifier_projet",
    description: "Vérifie le projet comme l'onglet Vérifier du studio : débordements mesurés sur le rendu réel, ton de voix, longueur des titres, part de vert, textes alternatifs, légende et hashtags.",
    inputSchema: { type: "object", properties: { projet: { type: "string" } }, required: ["projet"] },
    async run({ projet }) {
      await signaler("vérifie le projet", projet, null);
      const v = await api(`projets/${projet}/verifier`);
      return texte(v.length ? v : "Aucun problème : tout est dans la charte.");
    },
  },
  {
    name: "exporter_projet",
    description: "Exporte les PNG et la légende dans instagram/exports/<projet>/. À ne faire que si la personne le demande.",
    inputSchema: { type: "object", properties: { projet: { type: "string" } }, required: ["projet"] },
    async run({ projet }) {
      await signaler("exporte les images", projet, null);
      return texte(await api(`exporter/${projet}`, { methode: "POST" }));
    },
  },
  {
    name: "envoyer_message",
    description: "Affiche un message à la personne dans le studio (suggestion, question, compte rendu). Avec « projet », un bouton permet de l'ouvrir.",
    inputSchema: { type: "object", properties: { texte: { type: "string" }, projet: { type: "string" } }, required: ["texte"] },
    async run({ texte: t, projet }) {
      await api("evenements", { methode: "POST", corps: { auteur: NOM, texte: t, projet: projet ?? null } });
      return texte("Message affiché.");
    },
  },
  {
    name: "signaler",
    description: "Indique dans la barre du studio ce que vous êtes en train de faire (ex. « rédige la légende »), et sur quelle diapo.",
    inputSchema: { type: "object", properties: { activite: { type: "string" }, projet: { type: "string" }, diapo: { type: "string", description: "id de la diapo" } }, required: ["activite"] },
    async run({ activite, projet, diapo }) {
      await signaler(activite, projet ?? presence.projet, diapo ?? null);
      return texte("C'est affiché.");
    },
  },
  {
    name: "lister_articles",
    description: "Articles du blog HydroGrow (slug, titre, tags, description, image) pour créer un post à partir de l'un d'eux. Avec « article », renvoie aussi son texte complet.",
    inputSchema: { type: "object", properties: { article: { type: "string" } } },
    async run({ article } = {}) {
      const liste = await api("blog");
      if (article) return texte(liste.find((a) => a.slug === article) ?? `Article « ${article} » introuvable.`);
      return texte(liste.map(({ slug, titre, tags, description, image, date }) => ({ slug, titre, date, tags, description, image })));
    },
  },
  {
    name: "lister_images",
    description: "Images utilisables dans les diapos (champ image / portrait) : médias importés et images du site.",
    inputSchema: { type: "object", properties: {} },
    async run() {
      return texte(await api("images"));
    },
  },
];

const CHARTE = `Charte HydroGrow (résumé) :
- Ton : expert, calme, rassurant. On explique simplement, on ne dramatise jamais. Pas de capitales pour crier, pas de « !! », pas de grandes promesses (« révolutionnaire », « incroyable »). Mots justes : cultiver, pousser, récolter, local, frais, simple.
- Le vert pousse est rare (~7 %) : un seul *accent* court par titre au plus.
- Titres courts (moins de 50 caractères), une idée par diapo, le détail va dans la légende.
- Un carrousel commence par une couverture et finit par une diapo « fin » avec un appel à l'action (souvent hydrogrow.fr, lien en bio). 20 diapos au plus.
- Légende : accroche dans les 125 premiers caractères, appel à l'action, 3 à 5 hashtags, moins de 2 200 caractères. Texte alternatif sur chaque image.
- Photos : plans serrés, lumière naturelle, peu de personnes, jamais de banque d'images.
- Typographie française gérée automatiquement (espaces insécables, apostrophes).`;

const INSTRUCTIONS = `Ce serveur pilote le Studio Instagram HydroGrow, que la personne utilise en même temps dans son navigateur (${URL_STUDIO}).
Pour assister : appelez etat_studio pour voir où elle en est, catalogue pour connaître les modèles, lire_projet avant de modifier, puis modifier_projet avec un message clair. Vérifiez votre travail avec apercu et verifier_projet.
Travaillez à côté d'elle, pas à sa place : ne touchez pas au champ qu'elle est en train d'éditer, proposez par envoyer_message quand un changement est discutable, et n'exportez que si elle le demande.
${CHARTE}`;

// ---------- Protocole MCP (JSON-RPC sur stdio, un message par ligne) ----------

const envoyer = (m) => process.stdout.write(JSON.stringify(m) + "\n");
const repondre = (id, result) => envoyer({ jsonrpc: "2.0", id, result });
const erreur = (id, code, message) => envoyer({ jsonrpc: "2.0", id, error: { code, message } });

async function traiter(m) {
  const { id, method, params } = m;
  if (method === "initialize") {
    return repondre(id, {
      protocolVersion: params?.protocolVersion ?? "2025-06-18",
      capabilities: { tools: {} },
      serverInfo: { name: "studio-instagram-hydrogrow", version: "1.0.0" },
      instructions: INSTRUCTIONS,
    });
  }
  if (method === "ping") return repondre(id, {});
  if (method === "tools/list") return repondre(id, { tools: OUTILS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
  if (method === "tools/call") {
    const outil = OUTILS.find((o) => o.name === params?.name);
    if (!outil) return erreur(id, -32602, `Outil inconnu : ${params?.name}`);
    try {
      return repondre(id, await outil.run(params.arguments ?? {}));
    } catch (e) {
      return repondre(id, { content: [{ type: "text", text: `Erreur : ${e.message}` }], isError: true });
    }
  }
  if (id !== undefined) erreur(id, -32601, `Méthode non prise en charge : ${method}`);
}

createInterface({ input: process.stdin }).on("line", (ligne) => {
  if (!ligne.trim()) return;
  let m;
  try { m = JSON.parse(ligne); } catch { return erreur(null, -32700, "JSON invalide"); }
  traiter(m).catch((e) => m.id !== undefined && erreur(m.id, -32603, e.message));
});
process.stdin.on("end", () => process.exit(0));
