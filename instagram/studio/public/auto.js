// Génération automatique et semi-automatique, légende et vérifications de charte.
import { MODELES, nouvelId, valeursParDefaut } from "./modeles.js";

export const diapo = (modele, champs = {}, alt = "") => ({ id: nouvelId(), modele, champs: { ...valeursParDefaut(modele), ...champs }, alt });

// ---------- Hashtags ----------

export const HASHTAGS = {
  Marque: ["HydroGrow", "hydrogrowfr"],
  Hydroponie: ["hydroponie", "hydroponique", "cultureshorssol", "horssol", "aquaponie"],
  "Ville et local": ["agricultureurbaine", "circuitcourt", "mangerlocal", "potagerurbain", "fermeurbaine"],
  Tech: ["agtech", "IoT", "capteurs", "agriculturedeprecision", "smartfarming"],
  Projet: ["startup", "innovation", "Ydays", "coulisses"],
  Cultures: ["basilic", "salade", "fraises", "aromatiques", "microgreens"],
};

const PAR_TAG = {
  capteurs: ["capteurs", "IoT"], "tableau de bord": ["agtech"], guide: ["hydroponique"], ph: ["hydroponique"],
  ec: ["hydroponique"], eau: ["cultureshorssol"], automatisation: ["agtech", "IoT"], ia: ["agtech", "innovation"],
  maladies: ["cultureshorssol"], pompe: ["hydroponique"], température: ["capteurs"],
};

export function hashtagsPour(tags = []) {
  const s = new Set(["hydroponie"]);
  for (const t of tags) for (const h of PAR_TAG[t.toLowerCase()] ?? []) s.add(h);
  s.add("HydroGrow");
  return [...s].slice(0, 5);
}

export const APPELS = [
  "👉 hydrogrow.fr (lien en bio)",
  "📌 Enregistrez ce post pour plus tard.",
  "💬 Et vous, comment faites-vous ?",
  "🔁 Partagez-le à quelqu'un qui cultive.",
  "🌱 Suivez-nous pour voir le projet pousser.",
  "Article complet sur hydrogrow.fr (lien en bio)",
];

// ---------- Texte ----------

const nettoyer = (s) =>
  String(s ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const premierePhrase = (s, max = 150) => {
  const t = nettoyer(s);
  const p = t.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? t;
  return p.length > max ? `${p.slice(0, max).replace(/\s+\S*$/, "")}…` : p;
};

const raccourcir = (s, max) => (s.length > max ? `${s.slice(0, max).replace(/\s+\S*$/, "")}…` : s);
const majuscule = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Coupe un titre en deux lignes équilibrées et met en vert le premier groupe porteur
function titreCouverture(titre) {
  let t = titre.includes(" : ") ? titre.split(" : ").slice(1).join(" : ") : titre;
  t = majuscule(t.trim().replace(/[.]$/, ""));
  const mots = t.split(" ");
  if (mots.length <= 2) return t;
  let coupe = 1, meilleur = Infinity;
  for (let i = 1; i < mots.length; i++) {
    const ecart = Math.abs(mots.slice(0, i).join(" ").length - mots.slice(i).join(" ").length);
    if (ecart < meilleur) (meilleur = ecart), (coupe = i);
  }
  const a = mots.slice(0, coupe), b = mots.slice(coupe);
  const n = Math.min(2, a.length);
  return `*${a.slice(0, n).join(" ")}*${a.length > n ? ` ${a.slice(n).join(" ")}` : ""}\n${b.join(" ")}`;
}

const SUR_PAR_TAG = { guide: "Guide hydroponie", capteurs: "Capteurs", ia: "Intelligence artificielle", eau: "Eau", automatisation: "Automatisation" };

// ---------- Depuis un article du blog ----------

export function depuisArticle(a, { max = 6 } = {}) {
  const sections = [];
  let courante = null;
  for (const ligne of a.corps.split(/\r?\n/)) {
    const h = ligne.match(/^##\s+(.*)/);
    if (h) sections.push((courante = { titre: nettoyer(h[1]), paras: [], puces: [] }));
    else if (courante) {
      const puce = ligne.match(/^\s*(?:[-*]|\d+\.)\s+(.*)/);
      if (puce) courante.puces.push(nettoyer(puce[1]).replace(/\s*[;,]$/, "."));
      else if (ligne.trim() && !ligne.startsWith("|") && !ligne.startsWith("#")) courante.paras.push(ligne);
    }
  }
  const utiles = sections.filter((s) => !/hydrogrow/i.test(s.titre)).slice(0, max);
  const sur = SUR_PAR_TAG[a.tags.find((t) => SUR_PAR_TAG[t])] ?? "Guide hydroponie";
  const icones = ["idee", "goutte", "courbe", "horloge", "valide", "cloche", "boitier"];

  const diapos = [
    diapo("couverture-photo", { image: a.image, sur, titre: titreCouverture(a.titre), texte: raccourcir(nettoyer(a.description), 120) }, a.imageAlt ? `${a.imageAlt}, avec le titre « ${a.titre} ».` : ""),
    ...utiles.map((s, i) => {
      const cartes = s.puces
        .slice(0, 2)
        .map((p) => {
          const [k, ...v] = p.split(/\s:\s/);
          return v.length ? `${raccourcir(k, 40)} | ${raccourcir(v.join(" : "), 110)}` : ` | ${raccourcir(p, 120)}`;
        })
        .join("\n");
      return diapo(
        "fiche",
        { sur: `Point ${i + 1} sur ${utiles.length}`, icone: icones[i % icones.length], titre: s.titre, texte: premierePhrase(s.paras.join(" "), cartes ? 130 : 220), cartes },
        `${s.titre}.`,
      );
    }),
    diapo("fin", { titre: "Le guide complet\nest sur *hydrogrow.fr*", texte: "Enregistrez ce post pour le retrouver.", pastille: "Lien en bio" }, "Rendez-vous sur hydrogrow.fr pour lire le guide complet."),
  ];

  return {
    titre: a.titre,
    diapos,
    legende: {
      texte: `${a.titre} 💧\n\n${nettoyer(a.description)}\n\n📌 Enregistrez ce post pour plus tard.\n💬 Une question ? Posez-la en commentaire.\n\nArticle complet sur hydrogrow.fr (lien en bio)`,
      hashtags: hashtagsPour(a.tags),
    },
  };
}

// ---------- Depuis un plan écrit ----------
// Blocs séparés par une ligne « --- ». Voir l'aide dans le studio.

export const EXEMPLE_PLAN = `# *3 gestes* pour un relevé fiable
> Routine
Ce qu'on fait chaque matin, à la même heure.
@ /images/blog/hydroponie-ph.webp
---
## Mesurer
> Geste 1 sur 3
icone: ph
Le pH et l'EC d'abord, puis la température de l'eau.
- Quand | Toujours à la même heure.
- Pourquoi | Pour comparer ce qui est comparable.
---
= 5,5 à 6,5 | pH
La plage de la plupart des légumes-feuilles.
---
## En *résumé*
1. Mesurer | pH, EC, température.
2. Noter | Les valeurs et l'eau ajoutée.
3. Comparer | Avec la plage de la culture.
---
" Une valeur affichée n'est utile que si l'on peut lui faire *confiance*.
— Équipe HydroGrow
---
! Gardez une *trace*,
! pas seulement un chiffre.
Enregistrez ce post pour votre prochain relevé.
[hydrogrow.fr]`;

export function depuisPlan(plan) {
  const blocs = plan.split(/^\s*---\s*$/m).map((b) => b.split(/\r?\n/).map((l) => l.trimEnd()).filter((l) => l.trim()));
  const diapos = [];
  for (const [i, l] of blocs.entries()) {
    if (!l.length) continue;
    const pris = new Set();
    const prendre = (re) => {
      const k = l.findIndex((x, j) => !pris.has(j) && re.test(x));
      if (k < 0) return null;
      pris.add(k);
      return l[k];
    };
    const tous = (re) => l.map((x, j) => (!pris.has(j) && re.test(x) ? (pris.add(j), x) : null)).filter((x) => x !== null);
    const reste = () => l.filter((_, j) => !pris.has(j)).join("\n");

    const image = prendre(/^@\s*/)?.replace(/^@\s*/, "");
    const sur = prendre(/^>\s*/)?.replace(/^>\s*/, "") ?? "";
    const icone = prendre(/^icone:\s*/i)?.replace(/^icone:\s*/i, "");
    const pastille = prendre(/^\[.*\]$/)?.slice(1, -1) ?? "";
    const h1 = prendre(/^#\s+/)?.replace(/^#\s+/, "");
    const h2 = prendre(/^##\s+/)?.replace(/^##\s+/, "");
    const chiffre = prendre(/^=\s*/)?.replace(/^=\s*/, "");
    const etapes = tous(/^\d+[.)]\s+/).map((x) => x.replace(/^\d+[.)]\s+/, ""));
    const puces = tous(/^[-*]\s+/).map((x) => x.replace(/^[-*]\s+/, ""));
    const citation = tous(/^"\s*/).map((x) => x.replace(/^"\s*/, "")).join("\n");
    const auteur = prendre(/^[—–-]{1,2}\s+/)?.replace(/^[—–-]{1,2}\s+/, "");
    const fin = tous(/^!\s*/).map((x) => x.replace(/^!\s*/, "")).join("\n");
    const texte = reste();

    if (fin) diapos.push(diapo("fin", { titre: fin, texte, pastille }));
    else if (citation) diapos.push(diapo("citation", { sur, citation, auteur: auteur ?? "Équipe HydroGrow", role: "" }));
    else if (chiffre) {
      const [c, u] = chiffre.split("|").map((x) => x.trim());
      const [t, ...tx] = texte.split("\n");
      diapos.push(diapo("chiffre", { sur, chiffre: c, unite: u ?? "", titre: t ?? "", texte: tx.join(" "), source: "" }));
    } else if (etapes.length) diapos.push(diapo("etapes", { sur, titre: h2 ?? h1 ?? texte, etapes: etapes.join("\n") }));
    else if (h1 || (i === 0 && !h2)) {
      const titre = h1 ?? texte.split("\n")[0];
      const tx = h1 ? texte : texte.split("\n").slice(1).join(" ");
      diapos.push(image ? diapo("couverture-photo", { image, sur, titre, texte: tx, pastille }) : diapo("couverture", { sur, titre, texte: tx, pastille }));
    } else if (image && !h2) diapos.push(diapo("photo", { image, legende: texte }));
    else diapos.push(diapo("fiche", { sur, icone: icone ?? "", titre: h2 ?? "", texte, cartes: puces.map((p) => (p.includes("|") ? p : ` | ${p}`)).join("\n") }));
  }
  return diapos;
}

// ---------- Légende automatique ----------

export function legendeDepuisDiapos(diapos) {
  const brut = (s) => String(s ?? "").replace(/\*/g, "").replace(/\n/g, " ").trim();
  const c = diapos[0]?.champs ?? {};
  const titre = brut(c.titre || c.citation || "");
  const points = diapos
    .slice(1, -1)
    .map((d) => brut(d.champs.titre))
    .filter(Boolean)
    .slice(0, 6);
  return [
    `${titre} 🌱`,
    brut(c.texte),
    points.length > 1 ? `Au programme :\n${points.map((p) => `· ${p}`).join("\n")}` : "",
    diapos.length > 1 ? "📌 Enregistrez ce post pour plus tard." : "",
    "👉 hydrogrow.fr (lien en bio)",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function altAuto(d) {
  const brut = (s) => String(s ?? "").replace(/\*/g, "").replace(/\n/g, " ").trim();
  const c = d.champs;
  const titre = brut(c.titre || c.citation || c.legende);
  const fond = { "couverture-photo": "Photo de culture hydroponique", photo: "Photo", app: "Carte de l'application HydroGrow", notifications: "Notifications de l'application HydroGrow", chiffre: `Chiffre clé ${brut(c.chiffre)} ${brut(c.unite)}` }[d.modele];
  return fond ? `${fond}${titre ? `, avec le texte « ${titre} »` : ""}.` : titre ? `${titre}.` : "";
}

// ---------- Vérifications ----------
// Renvoie [{ niveau: "erreur" | "attention" | "conseil", texte, diapo? }]

const MOTS_ALARME = /\b(attention|urgent|catastrophe|danger|mourir|incroyable|révolution\w*|miracle|meilleur au monde|jamais vu)\b/i;
const SIGLES = new Set(["EC", "PH", "IOT", "CO2", "CO₂", "LED", "IA", "UV", "PPM", "DIY", "NFT", "DWC", "HG"]);

export function verifier(projet, debordements = new Set()) {
  const out = [];
  const add = (niveau, texte, diapo) => out.push({ niveau, texte, diapo });
  const n = projet.diapos.length;

  if (!n) add("erreur", "Le projet n'a aucune diapo.");
  if (n > 20) add("erreur", `Instagram accepte 20 images au plus par carrousel (${n} ici).`);
  if (projet.format === "story" && n > 1) add("conseil", "En story, chaque image est publiée séparément : pensez la pagination en conséquence.");

  projet.diapos.forEach((d, i) => {
    const c = d.champs ?? {};
    const k = i + 1;
    if (debordements.has(i)) add("erreur", "Le contenu dépasse du cadre : raccourcissez le texte ou retirez une carte.", k);
    const titre = String(c.titre ?? c.citation ?? "");
    const brut = titre.replace(/\*/g, "");
    if (brut.length > 70) add("attention", `Titre long (${brut.length} caractères) : visez moins de 50 pour une lecture en un coup d'œil.`, k);
    const accents = (titre.match(/\*[^*]+\*/g) ?? []).join("").replace(/\*/g, "");
    if (accents.length > 24) add("attention", "Beaucoup de vert dans le titre : la charte garde le vert pousse rare (environ 7 %).", k);
    const tout = Object.values(c).filter((v) => typeof v === "string").join(" ");
    if (/!{2,}/.test(tout)) add("attention", "Ponctuation appuyée (« !! ») : le ton HydroGrow reste calme.", k);
    if (MOTS_ALARME.test(tout)) add("attention", `Mot à éviter (« ${tout.match(MOTS_ALARME)[0]} ») : expert, calme, rassurant, jamais de grandes promesses.`, k);
    const capitales = (tout.match(/\b[A-ZÀ-Ý]{4,}\b/g) ?? []).filter((m) => !SIGLES.has(m));
    if (capitales.length) add("attention", `Mot en capitales (« ${capitales[0]} ») : on ne crie pas.`, k);
    if ((c.texte ?? "").length > 260) add("conseil", "Texte un peu long pour une diapo : gardez le détail pour la légende.", k);
    if ("image" in (MODELES[d.modele]?.champs.reduce((o, f) => ((o[f.id] = 1), o), {}) ?? {}) && !c.image) add("erreur", "Aucune photo choisie.", k);
    if (!d.alt) add("conseil", "Texte alternatif manquant (accessibilité).", k);
  });

  if (n > 1 && projet.diapos[n - 1]?.modele !== "fin") add("conseil", "Terminez le carrousel par une diapo « Fin » avec un appel à l'action.");

  const leg = projet.legende ?? {};
  const tags = leg.hashtags ?? [];
  const texte = leg.texte ?? "";
  const total = texte.length + tags.reduce((s, t) => s + t.length + 2, 0);
  if (!texte.trim()) add("attention", "Légende vide.");
  if (total > 2200) add("erreur", `Légende trop longue : ${total} caractères sur 2 200.`);
  if (tags.length > 30) add("erreur", `Trop de hashtags : ${tags.length} sur 30 autorisés.`);
  else if (tags.length > 5) add("conseil", `${tags.length} hashtags : Instagram recommande désormais 3 à 5 hashtags ciblés.`);
  if (texte && !/hydrogrow\.fr/i.test(texte)) add("conseil", "La légende ne renvoie pas vers hydrogrow.fr.");
  if (/#\w/.test(texte)) add("conseil", "Des hashtags sont écrits dans le texte : placez-les dans la liste dédiée.");
  if (/!{2,}/.test(texte)) add("attention", "Légende : ponctuation appuyée (« !! »), le ton HydroGrow reste calme.");
  if (MOTS_ALARME.test(texte)) add("attention", `Légende : mot à éviter (« ${texte.match(MOTS_ALARME)[0]} »).`);
  return out;
}
