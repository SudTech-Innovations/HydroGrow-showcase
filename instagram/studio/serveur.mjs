// Studio Instagram HydroGrow : serveur local, sans dépendance.
//   node instagram/studio/serveur.mjs          → http://localhost:4400
// Sert l'éditeur, les images du site, enregistre les projets (instagram/projets/*.json)
// et exporte les PNG avec Chrome sans interface (instagram/<projet>/1.png, 2.png…).
//
// Plusieurs éditeurs peuvent travailler en même temps (vous dans le navigateur, une IA via
// mcp.mjs ou l'API HTTP) : les modifications passent par des opérations appliquées sur la
// dernière version, et chaque changement est diffusé en direct (/api/evenements).
// Voir IA.md pour l'API.
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, watch } from "node:fs";
import { readFile, writeFile, unlink, readdir } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { appliquer, assurerIds } from "./public/operations.js";
import { altAuto, depuisArticle, depuisPlan, diapo, legendeDepuisDiapos, verifier } from "./public/auto.js";
import { FONDS, FORMATS, ICONES, MODELES } from "./public/modeles.js";

const ici = dirname(fileURLToPath(import.meta.url));
export const DOSSIERS = {
  public: join(ici, "public"),
  instagram: resolve(ici, ".."),
  projets: resolve(ici, "../projets"),
  medias: resolve(ici, "../medias"),
  images: resolve(ici, "../../hgshow/public/images"),
  blog: resolve(ici, "../../hgshow/src/content/blog"),
};
for (const d of [DOSSIERS.projets, DOSSIERS.medias]) mkdirSync(d, { recursive: true });

export const PORT = Number(process.env.PORT ?? 4400);
let portActif = PORT;
const CHROMES = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif",
  ".md": "text/markdown; charset=utf-8",
};
const IMAGES = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg"]);
const SLUG = /^[a-z0-9][a-z0-9-]{0,80}$/;

// Chemin sûr à l'intérieur d'un dossier (pas de « .. »)
function dans(base, rel) {
  const p = normalize(join(base, decodeURIComponent(rel)));
  return p === base || p.startsWith(base + sep) ? p : null;
}

// ---------- Diffusion en direct (Server-Sent Events) ----------

const abonnes = new Set();
export function diffuser(evt) {
  const msg = `data: ${JSON.stringify({ ...evt, quand: Date.now() })}\n\n`;
  for (const res of abonnes) res.write(msg);
}
setInterval(() => { for (const res of abonnes) res.write(": ping\n\n"); }, 25000).unref();

// Qui fait quoi : le navigateur et les IA signalent ce qu'ils regardent ou font
const presences = new Map();
function presencesActives() {
  const limite = Date.now() - 90_000;
  for (const [k, v] of presences) if (v.quand < limite) presences.delete(k);
  return [...presences.values()];
}
function signaler(p) {
  const qui = String(p.qui ?? "inconnu").slice(0, 40);
  const v = { qui, ia: p.ia ?? qui !== "humain", projet: p.projet ?? null, diapo: p.diapo ?? null, numero: p.numero ?? null, onglet: p.onglet ?? null, champ: p.champ ?? null, activite: p.activite ? String(p.activite).slice(0, 140) : "", quand: Date.now() };
  presences.set(qui, v);
  diffuser({ type: "presence", presences: presencesActives() });
  return v;
}

// ---------- Projets : lecture, écriture, verrou par projet ----------

const fichierProjet = (slug) => join(DOSSIERS.projets, `${slug}.json`);
const derniersEcrits = new Map(); // slug → contenu écrit par le serveur (pour ignorer nos propres écritures)
const verrous = new Map();
function sousVerrou(slug, fn) {
  const suite = (verrous.get(slug) ?? Promise.resolve()).then(fn, fn);
  verrous.set(slug, suite.catch(() => {}));
  return suite;
}

export async function charger(slug) {
  if (!SLUG.test(slug)) throw Object.assign(new Error("Nom de projet invalide."), { code: 400 });
  let brut;
  try { brut = await readFile(fichierProjet(slug), "utf8"); }
  catch { throw Object.assign(new Error(`Projet « ${slug} » introuvable.`), { code: 404 }); }
  const p = assurerIds(JSON.parse(brut));
  p.slug = slug;
  p.version ??= 1;
  return p;
}

async function ecrire(slug, p, { auteur = "inconnu", message = "", source = null, ops = null } = {}) {
  p.slug = slug;
  p.modifie = new Date().toISOString();
  const texte = JSON.stringify(p, null, 2) + "\n";
  derniersEcrits.set(slug, texte);
  await writeFile(fichierProjet(slug), texte);
  diffuser({ type: "projet", slug, version: p.version, auteur, message, source, ops });
  return p;
}

// Applique des opérations sur la dernière version, sans écraser les autres éditeurs
export function modifierProjet(slug, ops, meta = {}) {
  return sousVerrou(slug, async () => {
    const courant = await charger(slug);
    const erreurs = [];
    const nouveau = appliquer(courant, ops, { erreurs });
    nouveau.version = courant.version + 1;
    await ecrire(slug, nouveau, { ...meta, ops });
    return { projet: nouveau, erreurs };
  });
}

async function listeProjets() {
  const liste = [];
  for (const f of (await readdir(DOSSIERS.projets)).filter((f) => f.endsWith(".json"))) {
    try {
      const p = JSON.parse(await readFile(join(DOSSIERS.projets, f), "utf8"));
      liste.push({ slug: p.slug ?? f.slice(0, -5), titre: p.titre, date: p.date ?? "", statut: p.statut ?? "brouillon", format: p.format, diapos: p.diapos?.length ?? 0, apercu: p.diapos?.[0] ?? null, modifie: p.modifie ?? "" });
    } catch {}
  }
  return liste;
}

const slugifier = (s) =>
  String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/^(.{0,50})(-.*)?$/, "$1") || "post";

// Crée un projet depuis un titre, un plan écrit, un article du blog ou une liste de diapos
export async function creerProjet({ titre, format = "portrait", pied, plan, article, diapos, legende, statut = "brouillon", date = "" } = {}, meta = {}) {
  let base = { titre: titre ?? "Nouveau post", diapos: [], legende: null };
  if (article) {
    const a = (await articles()).find((x) => x.slug === article);
    if (!a) throw Object.assign(new Error(`Article « ${article} » introuvable.`), { code: 404 });
    base = { ...depuisArticle(a), ...(titre ? { titre } : {}) };
  } else if (plan) base.diapos = depuisPlan(plan);
  else if (diapos?.length) base.diapos = appliquer({ diapos: [] }, diapos.map((d) => ({ op: "ajouter", ...d }))).diapos;
  else base.diapos = [diapo("couverture"), diapo("fin")];
  if (!FORMATS[format]) format = "portrait";

  const liste = await listeProjets();
  const n = Math.max(0, ...liste.map((p) => parseInt(p.slug) || 0)) + 1;
  let slug = `${n}-${slugifier(base.titre)}`;
  while (liste.some((p) => p.slug === slug)) slug += "-2";
  const p = assurerIds({
    slug, version: 1, titre: base.titre, format, pied: pied ?? (base.diapos.length > 1 ? "pagination" : "site"), site: "hydrogrow.fr", statut, date,
    legende: legende ?? base.legende ?? { texte: "", hashtags: ["hydroponie", "HydroGrow"] },
    diapos: base.diapos,
  });
  if (!p.legende.texte) p.legende.texte = legendeDepuisDiapos(p.diapos);
  for (const d of p.diapos) d.alt ||= altAuto(d);
  await ecrire(slug, p, meta);
  diffuser({ type: "nouveau", slug, titre: p.titre, auteur: meta.auteur ?? "inconnu" });
  return p;
}

// Les modifications faites directement dans les fichiers JSON (par une IA, un éditeur de
// texte, git…) sont aussi diffusées au studio.
function surveillerFichiers() {
  const delais = new Map();
  try {
    watch(DOSSIERS.projets, (_, nom) => {
      if (!nom?.endsWith(".json")) return;
      const slug = nom.slice(0, -5);
      clearTimeout(delais.get(slug));
      delais.set(slug, setTimeout(async () => {
        const texte = await readFile(fichierProjet(slug), "utf8").catch(() => null);
        if (texte == null || texte === derniersEcrits.get(slug)) return;
        derniersEcrits.set(slug, texte);
        try {
          const p = JSON.parse(texte);
          diffuser({ type: "projet", slug, version: p.version ?? 0, auteur: "fichier", message: "Le fichier du projet a été modifié." });
        } catch {}
      }, 150));
    });
  } catch {}
}

// ---------- Articles et images ----------

async function fichiersImages(base, prefixe, sous = "") {
  const out = [];
  for (const e of await readdir(join(base, sous), { withFileTypes: true }).catch(() => [])) {
    const rel = sous ? `${sous}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await fichiersImages(base, prefixe, rel)));
    else if (IMAGES.has(extname(e.name).toLowerCase()) && !/^(logo|favicon|_)/.test(e.name)) out.push(`${prefixe}/${rel}`);
  }
  return out;
}
export async function images() {
  return { medias: await fichiersImages(DOSSIERS.medias, "/medias"), site: await fichiersImages(DOSSIERS.images, "/images") };
}

// Lecture volontairement simple du front matter des articles (une clé par ligne)
function lireArticle(nom, md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return null;
  const fm = m[1];
  const champ = (cle) => fm.match(new RegExp(`^${cle}:\\s*(.*)$`, "m"))?.[1]?.trim() ?? "";
  const sansGuillemets = (s) => s.replace(/^"(.*)"$/, "$1");
  if (champ("draft") === "true") return null;
  let tags = [];
  try { tags = JSON.parse(champ("tags") || "[]"); } catch {}
  return {
    slug: nom.replace(/\.md$/, ""),
    titre: sansGuillemets(champ("title")),
    date: champ("date"),
    tags,
    image: champ("featured_image").match(/image:\s*([^,}]+)/)?.[1]?.trim() ?? "",
    imageAlt: champ("featured_image").match(/image_alt:\s*([^}]+)/)?.[1]?.trim() ?? "",
    description: fm.match(/page_description:\s*"([^"]*)"/)?.[1] ?? "",
    corps: m[2],
  };
}
export async function articles() {
  const out = [];
  for (const f of (await readdir(DOSSIERS.blog).catch(() => [])).filter((f) => f.endsWith(".md"))) {
    const a = lireArticle(f, await readFile(join(DOSSIERS.blog, f), "utf8"));
    if (a) out.push(a);
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

// ---------- Rendu avec Chrome ----------

function chrome() {
  const c = CHROMES.find((p) => existsSync(p));
  if (!c) throw new Error("Chrome ou Edge introuvable. Indiquez son chemin dans la variable CHROME.");
  return c;
}
const lancer = (exe, args, opts = {}) =>
  new Promise((ok, ko) => execFile(exe, args, { timeout: 90000, maxBuffer: 64 * 1024 * 1024, ...opts }, (err, stdout) => (err ? ko(err) : ok(stdout))));

async function avecProfil(fn) {
  const tmp = mkdtempSync(join(tmpdir(), "hg-studio-"));
  try { return await fn(tmp); }
  finally { try { rmSync(tmp, { recursive: true, force: true }); } catch {} }
}
const argsChrome = (tmp, l, h, echelle = 1) => [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", `--force-device-scale-factor=${echelle}`,
  `--window-size=${l},${h}`, "--virtual-time-budget=15000", `--user-data-dir=${join(tmp, "profil")}`,
];

async function capturer(url, l, h, png, echelle = 1) {
  await avecProfil((tmp) => lancer(chrome(), [...argsChrome(tmp, l, h, echelle), `--screenshot=${png}`, url]));
}

// Planche : toutes les diapos côte à côte, en petit (pour qu'une IA voie le carrousel d'un coup)
export function taillePlanche(p, larg = 360) {
  const f = FORMATS[p.format ?? "portrait"];
  const cols = Math.min(3, p.diapos.length), lignes = Math.ceil(p.diapos.length / 3);
  const h = Math.round((larg * f.h) / f.l);
  return { l: cols * larg + (cols + 1) * 16, h: lignes * (h + 36) + 16, larg };
}

// Image PNG d'une diapo (1 = première) ou de la planche complète. echelle 0.5 = moitié de la taille réelle.
export async function apercu(slug, quoi = "planche", echelle = 1) {
  echelle = Math.min(1, Math.max(0.25, Number(echelle) || 1));
  const p = await charger(slug);
  const f = FORMATS[p.format ?? "portrait"];
  return avecProfil(async (tmp) => {
    const png = join(tmp, "apercu.png");
    if (quoi === "planche") {
      const t = taillePlanche(p);
      await capturer(`http://127.0.0.1:${portActif}/rendu.html?projet=${slug}&planche=${t.larg}`, t.l, t.h, png, echelle);
    } else {
      const i = Number(quoi) - 1;
      if (!(i >= 0 && i < p.diapos.length)) throw Object.assign(new Error(`Diapo ${quoi} introuvable (le projet en a ${p.diapos.length}).`), { code: 404 });
      await capturer(`http://127.0.0.1:${portActif}/rendu.html?projet=${slug}&diapo=${i}`, f.l, f.h, png, echelle);
    }
    return readFile(png);
  });
}

// Mesure le débordement réel de chaque diapo (même rendu que l'export), puis vérifie la charte
export async function verifierProjet(slug) {
  const p = await charger(slug);
  const dom = await avecProfil((tmp) => lancer(chrome(), [...argsChrome(tmp, 1200, 1000), "--dump-dom", `http://127.0.0.1:${portActif}/rendu.html?projet=${slug}&mesure=1`]));
  let deborde = [];
  try { deborde = JSON.parse(dom.match(/<pre id="mesure">([\s\S]*?)<\/pre>/)[1]); } catch {}
  return verifier(p, new Set(deborde));
}

// Exporte toutes les diapos d'un projet en PNG, plus sa légende en Markdown
export async function exporter(slug, { port = portActif, log = () => {} } = {}) {
  const projet = await charger(slug);
  const f = FORMATS[projet.format ?? "portrait"];
  const sortie = join(DOSSIERS.instagram, slug);
  mkdirSync(sortie, { recursive: true });
  const fichiers = [];
  await avecProfil(async (tmp) => {
    for (let i = 0; i < projet.diapos.length; i++) {
      const png = join(sortie, `${i + 1}.png`);
      await lancer(chrome(), [...argsChrome(tmp, f.l, f.h), `--screenshot=${png}`, `http://127.0.0.1:${port}/rendu.html?projet=${slug}&diapo=${i}`]);
      fichiers.push(`${slug}/${i + 1}.png`);
      log(png);
    }
  });
  // Retire les PNG en trop d'un export précédent plus long
  for (const nom of readdirSync(sortie)) {
    const n = nom.match(/^(\d+)\.png$/)?.[1];
    if (n && Number(n) > projet.diapos.length) await unlink(join(sortie, nom));
  }
  await writeFile(join(sortie, "legende.md"), legendeMarkdown(projet));
  diffuser({ type: "export", slug, fichiers });
  return fichiers;
}

export function legendeMarkdown(p) {
  const tags = (p.legende?.hashtags ?? []).map((t) => `#${t}`).join(" ");
  const alts = p.diapos
    .map((d, i) => (d.alt ? `- Image ${i + 1} : ${d.alt}` : ""))
    .filter(Boolean)
    .join("\n");
  return `# ${p.titre}\n\n${p.date ? `Publication prévue : ${p.date}\n\n` : ""}Fichiers : ${p.diapos.length > 1 ? `\`1.png\` à \`${p.diapos.length}.png\`, dans l'ordre (carrousel)` : "`1.png`"}\n\n## Légende\n\n\`\`\`\n${(p.legende?.texte ?? "").trim()}${tags ? `\n\n${tags}` : ""}\n\`\`\`\n${alts ? `\n## Textes alternatifs\n\n${alts}\n` : ""}`;
}

// Description des modèles pour une IA (champs, types, options, valeurs par défaut)
export function catalogue() {
  return {
    formats: FORMATS,
    fonds: FONDS,
    icones: Object.keys(ICONES),
    modeles: Object.fromEntries(
      Object.entries(MODELES).map(([k, m]) => [k, { nom: m.nom, groupe: m.groupe, description: m.description, champs: m.champs.map(({ id, label, type, options, defaut, aide, min, max }) => ({ id, label, type, ...(options ? { options: Object.keys(options) } : {}), defaut, ...(aide ? { aide } : {}), ...(min != null ? { min, max } : {}) })) }]),
    ),
  };
}

// ---------- HTTP ----------

async function corpsRequete(req, max = 25 * 1024 * 1024) {
  const morceaux = [];
  let taille = 0;
  for await (const m of req) {
    taille += m.length;
    if (taille > max) throw new Error("Fichier trop lourd (25 Mo maximum).");
    morceaux.push(m);
  }
  return Buffer.concat(morceaux);
}
const corpsJson = async (req) => {
  const b = (await corpsRequete(req)).toString("utf8");
  return b ? JSON.parse(b) : {};
};

const json = (res, code, data) => {
  res.writeHead(code, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(data));
};

async function servirFichier(res, chemin) {
  try {
    const data = await readFile(chemin);
    res.writeHead(200, { "content-type": TYPES[extname(chemin).toLowerCase()] ?? "application/octet-stream", "cache-control": "no-cache" });
    res.end(data);
  } catch {
    res.writeHead(404).end("Introuvable");
  }
}

async function api(req, res, url) {
  const [, , route, param, sous] = url.pathname.split("/");
  const m = req.method;

  if (route === "evenements" && m === "GET") {
    res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store", connection: "keep-alive" });
    res.write(`data: ${JSON.stringify({ type: "presence", presences: presencesActives() })}\n\n`);
    abonnes.add(res);
    req.on("close", () => abonnes.delete(res));
    return;
  }
  // Message libre d'un éditeur à l'autre (ex. une IA qui propose quelque chose)
  if (route === "evenements" && m === "POST") {
    const e = await corpsJson(req);
    diffuser({ type: "message", auteur: String(e.auteur ?? "IA"), texte: String(e.texte ?? "").slice(0, 400), projet: e.projet ?? null, diapo: e.diapo ?? null });
    return json(res, 200, { ok: true });
  }
  if (route === "presence") {
    if (m === "POST") return json(res, 200, signaler(await corpsJson(req)));
    return json(res, 200, presencesActives());
  }
  if (route === "modeles" && m === "GET") return json(res, 200, catalogue());

  if (route === "projets" && !param) {
    if (m === "GET") return json(res, 200, await listeProjets());
    if (m === "POST") {
      const corps = await corpsJson(req);
      return json(res, 201, await creerProjet(corps, { auteur: corps.auteur ?? "inconnu", source: corps.source ?? null }));
    }
  }

  if (route === "projets" && param) {
    if (!SLUG.test(param)) return json(res, 400, { erreur: "Nom de projet invalide." });
    if (!sous && m === "GET") return json(res, 200, await charger(param));
    if (!sous && m === "PUT") {
      // Remplacement complet (création depuis le studio, scripts). Les éditeurs en cours
      // préfèrent /operations, qui ne peut pas écraser le travail des autres.
      const p = assurerIds(await corpsJson(req));
      const r = await sousVerrou(param, async () => {
        const ancien = await charger(param).catch(() => null);
        p.version = (ancien?.version ?? 0) + 1;
        return ecrire(param, p, { auteur: String(req.headers["x-auteur"] ?? "inconnu"), source: req.headers["x-source"] ?? null, message: "Projet remplacé." });
      });
      return json(res, 200, { ok: true, version: r.version });
    }
    if (!sous && m === "DELETE") {
      // Le projet seul est retiré ; les PNG déjà exportés restent en place
      await unlink(fichierProjet(param)).catch(() => {});
      diffuser({ type: "supprime", slug: param });
      return json(res, 200, { ok: true });
    }
    if (sous === "operations" && m === "POST") {
      const { ops, auteur = "inconnu", message = "", source = null } = await corpsJson(req);
      if (!Array.isArray(ops)) return json(res, 400, { erreur: "« ops » doit être une liste d'opérations." });
      return json(res, 200, await modifierProjet(param, ops, { auteur, message, source }));
    }
    if (sous === "apercu" && m === "GET") {
      const png = await apercu(param, url.searchParams.get("diapo") ?? "planche", url.searchParams.get("echelle") ?? 1);
      res.writeHead(200, { "content-type": "image/png", "cache-control": "no-store" });
      return res.end(png);
    }
    if (sous === "verifier" && m === "GET") return json(res, 200, await verifierProjet(param));
    if (sous === "legende" && m === "GET") return servirTexte(res, legendeMarkdown(await charger(param)));
  }

  if (route === "exporter" && param && m === "POST") {
    if (!SLUG.test(param)) return json(res, 400, { erreur: "Nom de projet invalide." });
    const fichiers = await exporter(param);
    return json(res, 200, { dossier: join(DOSSIERS.instagram, param), fichiers });
  }

  if (route === "images" && m === "GET") return json(res, 200, await images());

  if (route === "medias" && m === "POST") {
    const nom = String(req.headers["x-nom"] ?? "image")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
    const ext = extname(nom);
    if (!IMAGES.has(ext) || ext === ".svg") return json(res, 400, { erreur: "Formats acceptés : jpg, png, webp, avif." });
    let final = nom, n = 1;
    while (existsSync(join(DOSSIERS.medias, final))) final = nom.replace(ext, `-${++n}${ext}`);
    await writeFile(join(DOSSIERS.medias, final), await corpsRequete(req));
    return json(res, 200, { url: `/medias/${final}` });
  }

  if (route === "blog" && m === "GET") return json(res, 200, await articles());

  return json(res, 404, { erreur: "Route inconnue." });
}

function servirTexte(res, texte) {
  res.writeHead(200, { "content-type": "text/markdown; charset=utf-8", "cache-control": "no-store" });
  res.end(texte);
}

export function demarrer(port = PORT) {
  portActif = port;
  const serveur = createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    try {
      if (url.pathname.startsWith("/api/")) return await api(req, res, url);
      if (url.pathname.startsWith("/images/")) {
        const p = dans(DOSSIERS.images, url.pathname.slice(8));
        return p ? servirFichier(res, p) : res.writeHead(403).end();
      }
      if (url.pathname.startsWith("/medias/")) {
        const p = dans(DOSSIERS.medias, url.pathname.slice(8));
        return p ? servirFichier(res, p) : res.writeHead(403).end();
      }
      if (url.pathname.startsWith("/exports/")) {
        const p = dans(DOSSIERS.instagram, url.pathname.slice(9));
        return p && p.endsWith(".png") ? servirFichier(res, p) : res.writeHead(403).end();
      }
      const p = dans(DOSSIERS.public, url.pathname === "/" ? "index.html" : url.pathname.slice(1));
      return p ? servirFichier(res, p) : res.writeHead(403).end();
    } catch (e) {
      if (!res.headersSent) json(res, e.code >= 400 && e.code < 500 ? e.code : 500, { erreur: e.message });
    }
  });
  surveillerFichiers();
  return new Promise((ok, ko) => {
    serveur.once("error", ko);
    serveur.listen(port, "127.0.0.1", () => ok(serveur));
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await demarrer();
  console.log(`Studio Instagram HydroGrow : http://localhost:${PORT}`);
}
