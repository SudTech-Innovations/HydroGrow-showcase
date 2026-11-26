// Opérations d'édition d'un projet. Plusieurs éditeurs (le studio dans le navigateur, une IA
// via MCP ou l'API HTTP) envoient des opérations plutôt que le projet entier : le serveur les
// applique sur la dernière version, donc personne n'écrase le travail de l'autre.
//
// Une diapo se désigne par son id (stable) ou par sa position (1 = première).
//
//   { op: "projet", champ: "titre" | "format" | "pied" | "statut" | "date" | "site", valeur }
//   { op: "legende", valeur: "texte de la légende" }
//   { op: "hashtags", valeur: ["hydroponie", "HydroGrow"] }
//   { op: "champ", diapo, champ: "titre", valeur: "…" }
//   { op: "champs", diapo, valeurs: { titre: "…", texte: "…" } }
//   { op: "alt", diapo, valeur: "…" }
//   { op: "modele", diapo, modele: "fiche", champs?: {…} }
//   { op: "ajouter", apres?: diapo | 0, modele, champs?: {…}, alt? }   (apres: 0 = en tête ; absent = à la fin)
//   { op: "plan", apres?: diapo | 0, texte: "plan écrit" }             (voir depuisPlan)
//   { op: "supprimer", diapo }
//   { op: "deplacer", diapo, apres: diapo | 0 }
//   { op: "ordre", ids: [id, id, …] }
import { MODELES, nouvelId, valeursParDefaut } from "./modeles.js";
import { altAuto, depuisPlan } from "./auto.js";

export const CHAMPS_PROJET = ["titre", "format", "pied", "statut", "date", "site"];

export function assurerIds(p) {
  const vus = new Set();
  for (const d of p.diapos ?? []) {
    if (!d.id || vus.has(d.id)) d.id = nouvelId();
    vus.add(d.id);
  }
  p.legende ??= { texte: "", hashtags: [] };
  p.legende.hashtags ??= [];
  return p;
}

const egal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function indexDe(p, ref) {
  if (typeof ref === "number" || /^\d+$/.test(String(ref))) {
    const i = Number(ref) - 1;
    return i >= 0 && i < p.diapos.length ? i : -1;
  }
  return p.diapos.findIndex((d) => d.id === ref);
}

function insererApres(p, apres, nouvelles) {
  let pos = p.diapos.length;
  if (apres === 0 || apres === "0" || apres === "debut") pos = 0;
  else if (apres != null) {
    const i = indexDe(p, apres);
    if (i >= 0) pos = i + 1;
  }
  p.diapos.splice(pos, 0, ...nouvelles);
}

// Applique des opérations sur une copie du projet. Les opérations qui visent une diapo
// supprimée entre-temps sont ignorées et listées dans `ignorees`.
export function appliquer(projet, ops, { erreurs = [] } = {}) {
  const p = assurerIds(structuredClone(projet));
  for (const o of ops ?? []) {
    const i = o.diapo != null ? indexDe(p, o.diapo) : -1;
    const d = p.diapos[i];
    const manque = () => erreurs.push(`${o.op} : diapo « ${o.diapo} » introuvable`);
    switch (o.op) {
      case "projet":
        if (CHAMPS_PROJET.includes(o.champ)) p[o.champ] = o.valeur;
        else erreurs.push(`projet : champ « ${o.champ} » inconnu`);
        break;
      case "legende":
        p.legende.texte = String(o.valeur ?? "");
        break;
      case "hashtags":
        p.legende.hashtags = (o.valeur ?? []).map((t) => String(t).replace(/^#/, "").trim()).filter(Boolean);
        break;
      case "champ":
        if (!d) manque();
        else d.champs[o.champ] = o.valeur;
        break;
      case "champs":
        if (!d) manque();
        else Object.assign(d.champs, o.valeurs ?? {});
        break;
      case "alt":
        if (!d) manque();
        else d.alt = String(o.valeur ?? "");
        break;
      case "modele":
        if (!d) manque();
        else if (!MODELES[o.modele]) erreurs.push(`modèle « ${o.modele} » inconnu`);
        else {
          // On garde les champs communs à l'ancien et au nouveau modèle
          const ids = new Set(MODELES[o.modele].champs.map((c) => c.id));
          const garde = Object.fromEntries(Object.entries(d.champs).filter(([k, v]) => ids.has(k) && v !== "" && v != null));
          d.modele = o.modele;
          d.champs = { ...valeursParDefaut(o.modele), ...garde, ...(o.champs ?? {}) };
        }
        break;
      case "ajouter": {
        if (!MODELES[o.modele]) {
          erreurs.push(`modèle « ${o.modele} » inconnu`);
          break;
        }
        const nd = { id: o.id ?? nouvelId(), modele: o.modele, champs: { ...valeursParDefaut(o.modele), ...(o.champs ?? {}) }, alt: o.alt ?? "" };
        if (!nd.alt) nd.alt = altAuto(nd);
        insererApres(p, o.apres, [nd]);
        break;
      }
      case "plan": {
        const nouvelles = depuisPlan(String(o.texte ?? ""));
        for (const n of nouvelles) n.alt ||= altAuto(n);
        insererApres(p, o.apres, nouvelles);
        break;
      }
      case "supprimer":
        if (d) p.diapos.splice(i, 1);
        break;
      case "deplacer":
        if (!d) manque();
        else {
          p.diapos.splice(i, 1);
          insererApres(p, o.apres, [d]);
        }
        break;
      case "ordre": {
        // Ordre voulu pour les diapos connues ; celles ajoutées ailleurs restent après leur voisine
        const voulu = (o.ids ?? []).filter((id) => p.diapos.some((x) => x.id === id));
        const res = p.diapos.filter((x) => voulu.includes(x.id)).sort((a, b) => voulu.indexOf(a.id) - voulu.indexOf(b.id));
        p.diapos.forEach((x, k) => {
          if (voulu.includes(x.id)) return;
          const avant = p.diapos.slice(0, k).reverse().find((y) => voulu.includes(y.id) || res.includes(y));
          res.splice(avant ? res.indexOf(avant) + 1 : 0, 0, x);
        });
        p.diapos = res;
        break;
      }
      default:
        erreurs.push(`opération « ${o.op} » inconnue`);
    }
  }
  return p;
}

// Opérations qui transforment a en b (sert au studio pour n'envoyer que ses changements)
export function difference(a, b) {
  const ops = [];
  for (const c of CHAMPS_PROJET) if (!egal(a[c], b[c])) ops.push({ op: "projet", champ: c, valeur: b[c] });
  if ((a.legende?.texte ?? "") !== (b.legende?.texte ?? "")) ops.push({ op: "legende", valeur: b.legende?.texte ?? "" });
  if (!egal(a.legende?.hashtags ?? [], b.legende?.hashtags ?? [])) ops.push({ op: "hashtags", valeur: b.legende?.hashtags ?? [] });

  const avant = new Map(a.diapos.map((d) => [d.id, d]));
  const apres = new Set(b.diapos.map((d) => d.id));
  for (const d of a.diapos) if (!apres.has(d.id)) ops.push({ op: "supprimer", diapo: d.id });
  b.diapos.forEach((d, k) => {
    const v = avant.get(d.id);
    if (!v) {
      ops.push({ op: "ajouter", id: d.id, apres: k ? b.diapos[k - 1].id : 0, modele: d.modele, champs: d.champs, alt: d.alt ?? "" });
      return;
    }
    if (v.modele !== d.modele) ops.push({ op: "modele", diapo: d.id, modele: d.modele, champs: d.champs });
    else
      for (const c of new Set([...Object.keys(v.champs), ...Object.keys(d.champs)]))
        if (!egal(v.champs[c], d.champs[c])) ops.push({ op: "champ", diapo: d.id, champ: c, valeur: d.champs[c] });
    if ((v.alt ?? "") !== (d.alt ?? "")) ops.push({ op: "alt", diapo: d.id, valeur: d.alt ?? "" });
  });
  const communsA = a.diapos.map((d) => d.id).filter((id) => apres.has(id));
  const communsB = b.diapos.map((d) => d.id).filter((id) => avant.has(id));
  if (!egal(communsA, communsB)) ops.push({ op: "ordre", ids: b.diapos.map((d) => d.id) });
  return ops;
}
