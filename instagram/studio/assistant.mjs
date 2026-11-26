// Outil en ligne de commande pour une IA qui assiste dans le studio, quand les outils MCP
// ne sont pas chargés (même effet que mcp.mjs, via l'API HTTP). Utilisé par le skill /instagram-hg.
//
//   node instagram/studio/assistant.mjs demarrer            lance le studio si besoin et se connecte (pastille « Claude »)
//   node instagram/studio/assistant.mjs etat                ce que fait la personne + liste des projets
//   node instagram/studio/assistant.mjs catalogue           modèles, champs, opérations, charte
//   node instagram/studio/assistant.mjs lire <projet>
//   node instagram/studio/assistant.mjs ops <projet> <fichier.json>     { "message": "…", "ops": [ … ] }
//   node instagram/studio/assistant.mjs creer <fichier.json>            { "titre", "format", "plan" | "article" | "diapos", "message" }
//   node instagram/studio/assistant.mjs apercu <projet> [n|planche] [sortie.png] [echelle]
//   node instagram/studio/assistant.mjs verifier <projet>
//   node instagram/studio/assistant.mjs message <texte | @fichier.txt> [projet]
//   node instagram/studio/assistant.mjs signaler <activite> [projet] [diapo]
//   node instagram/studio/assistant.mjs quitter             retire la pastille et arrête la veille
//
// Les textes passent par des fichiers JSON en UTF-8 : sous Windows, les accents tapés
// directement dans le terminal peuvent être abîmés.
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ici = dirname(fileURLToPath(import.meta.url));
const URL_STUDIO = (process.env.STUDIO_URL ?? "http://127.0.0.1:4400").replace(/\/$/, "");
const NOM = process.env.STUDIO_IA_NOM ?? "Claude";
const FICHIER_VEILLE = join(tmpdir(), `hg-studio-veille-${NOM}.json`);
const [commande, ...args] = process.argv.slice(2);

const pause = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(chemin, { methode = "GET", corps, brut = false } = {}) {
  const r = await fetch(`${URL_STUDIO}/api/${chemin}`, { method: methode, body: corps ? JSON.stringify(corps) : undefined });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e.erreur ?? `Erreur ${r.status} sur ${chemin}`);
  }
  return brut ? Buffer.from(await r.arrayBuffer()) : r.json();
}
const joignable = () => fetch(`${URL_STUDIO}/api/presence`).then(() => true, () => false);
const afficher = (x) => console.log(typeof x === "string" ? x : JSON.stringify(x, null, 2));
const lireJson = (f) => JSON.parse(readFileSync(resolve(f), "utf8").replace(/^﻿/, ""));
const signaler = (activite, projet = null, diapo = null) => api("presence", { methode: "POST", corps: { qui: NOM, ia: true, activite, projet, diapo } });

const resume = (p) => ({
  projet: p.slug, version: p.version, titre: p.titre, format: p.format, pied: p.pied, statut: p.statut, date: p.date, legende: p.legende,
  diapos: p.diapos.map((d, i) => ({ n: i + 1, id: d.id, modele: d.modele, champs: d.champs, alt: d.alt })),
});

async function etatPersonne(slug) {
  const h = (await api("presence")).find((p) => p.qui === "humain");
  if (!h) return "studio fermé dans le navigateur";
  return { projet: h.projet, diapo: h.numero, diapoId: h.diapo, onglet: h.onglet, champEnCours: h.champ, ...(slug && h.projet === slug && h.champ ? { attention: `La personne édite « ${h.champ} » : n'y touchez pas en même temps.` } : {}) };
}

const commandes = {
  async demarrer() {
    if (!(await joignable())) {
      const port = new URL(URL_STUDIO).port || "4400";
      const p = spawn(process.execPath, [join(ici, "serveur.mjs")], { detached: true, stdio: "ignore", windowsHide: true, env: { ...process.env, PORT: port } });
      p.unref();
      for (let i = 0; i < 50 && !(await joignable()); i++) await pause(200);
      if (!(await joignable())) throw new Error("Le studio n'a pas démarré.");
      console.log(`Studio démarré : ${URL_STUDIO}`);
    } else console.log(`Studio déjà lancé : ${URL_STUDIO}`);
    // Veille en arrière-plan : garde la pastille « Claude · à l'écoute » tant que la session dure
    const ancienne = existsSync(FICHIER_VEILLE) ? lireJson(FICHIER_VEILLE).pid : null;
    let vivante = false;
    if (ancienne) try { process.kill(ancienne, 0); vivante = true; } catch {}
    if (!vivante) {
      const v = spawn(process.execPath, [fileURLToPath(import.meta.url), "veille"], { detached: true, stdio: "ignore", windowsHide: true, env: process.env });
      v.unref();
      writeFileSync(FICHIER_VEILLE, JSON.stringify({ pid: v.pid }));
    }
    await signaler("à l'écoute");
    afficher({ studio: URL_STUDIO, ia: NOM, personne: await etatPersonne() });
  },

  // Processus de fond : rafraîchit la présence si l'IA n'a rien signalé depuis une minute
  async veille() {
    const fin = Date.now() + 12 * 3600_000;
    let absences = 0;
    while (Date.now() < fin) {
      try {
        const moi = (await api("presence")).find((p) => p.qui === NOM);
        if (!moi || Date.now() - moi.quand > 60_000) await signaler("à l'écoute", moi?.projet ?? null, null);
        absences = 0;
      } catch {
        if (++absences > 20) break; // studio arrêté depuis 10 minutes
      }
      await pause(30_000);
    }
  },

  async quitter() {
    if (existsSync(FICHIER_VEILLE)) {
      try { process.kill(lireJson(FICHIER_VEILLE).pid); } catch {}
      unlinkSync(FICHIER_VEILLE);
    }
    await api(`presence/${encodeURIComponent(NOM)}`, { methode: "DELETE" }).catch(() => {});
    console.log("Déconnecté du studio (le studio reste lancé).");
  },

  async etat() {
    const [presences, projets] = await Promise.all([api("presence"), api("projets")]);
    afficher({
      personne: await etatPersonne(),
      autresIA: presences.filter((p) => p.ia && p.qui !== NOM).map(({ qui, projet, activite }) => ({ qui, projet, activite })),
      projets: projets.map(({ slug, titre, statut, date, format, diapos }) => ({ projet: slug, titre, statut, date, format, diapos })),
    });
  },

  async catalogue() {
    afficher(await api("modeles"));
    console.log("\nOpérations : voir l'en-tête de instagram/studio/public/operations.js. Plan écrit : voir EXEMPLE_PLAN dans public/auto.js.");
  },

  async lire([projet]) {
    await signaler("lit le projet", projet);
    afficher({ ...resume(await api(`projets/${projet}`)), personne: await etatPersonne(projet) });
  },

  async ops([projet, fichier]) {
    const donnees = lireJson(fichier);
    const ops = Array.isArray(donnees) ? donnees : donnees.ops;
    const message = Array.isArray(donnees) ? "" : donnees.message ?? "";
    const cible = ops.find((o) => o.diapo != null)?.diapo ?? null;
    await signaler(message || "modifie le projet", projet, typeof cible === "string" ? cible : null);
    const r = await api(`projets/${projet}/operations`, { methode: "POST", corps: { ops, auteur: NOM, message, source: `cli-${NOM}` } });
    afficher({ ...(r.erreurs?.length ? { erreurs: r.erreurs } : {}), version: r.projet.version, diapos: r.projet.diapos.map((d, i) => `${i + 1} · ${d.id} · ${d.modele} · ${String(d.champs.titre ?? d.champs.citation ?? d.champs.legende ?? "").replace(/\n/g, " ")}`) });
  },

  async creer([fichier]) {
    const corps = lireJson(fichier);
    await signaler(`crée « ${corps.titre ?? "un projet"} »`);
    const p = await api("projets", { methode: "POST", corps: { ...corps, auteur: NOM } });
    if (corps.message) await api("evenements", { methode: "POST", corps: { auteur: NOM, texte: corps.message, projet: p.slug } });
    await signaler("à l'écoute", p.slug);
    afficher(resume(p));
  },

  async apercu([projet, quoi = "planche", sortie, echelle]) {
    await signaler(quoi === "planche" ? "regarde le rendu" : `regarde la diapo ${quoi}`, projet);
    const png = await api(`projets/${projet}/apercu?diapo=${quoi}&echelle=${echelle ?? (quoi === "planche" ? 1 : 0.5)}`, { brut: true });
    const f = resolve(sortie ?? join(tmpdir(), `apercu-${projet}-${quoi}.png`));
    writeFileSync(f, png);
    console.log(f);
  },

  async verifier([projet]) {
    await signaler("vérifie le projet", projet);
    const v = await api(`projets/${projet}/verifier`);
    afficher(v.length ? v : "Aucun problème : tout est dans la charte.");
  },

  async message([texte, projet]) {
    const t = texte?.startsWith("@") ? readFileSync(texte.slice(1), "utf8").trim() : texte;
    await api("evenements", { methode: "POST", corps: { auteur: NOM, texte: t, projet: projet ?? null } });
    console.log("Message affiché dans le studio.");
  },

  async signaler([activite, projet, diapo]) {
    await signaler(activite, projet ?? null, diapo ?? null);
    console.log("Activité affichée.");
  },
};

if (!commandes[commande]) {
  console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").filter((l) => l.startsWith("//")).map((l) => l.slice(3)).join("\n"));
  process.exit(commande ? 1 : 0);
}
if (commande !== "demarrer" && commande !== "veille" && !(await joignable())) {
  console.error(`Le studio ne répond pas sur ${URL_STUDIO}. Lancez d'abord : node instagram/studio/assistant.mjs demarrer`);
  process.exit(1);
}
try {
  await commandes[commande](args);
} catch (e) {
  console.error(`Erreur : ${e.message}`);
  process.exit(1);
}
