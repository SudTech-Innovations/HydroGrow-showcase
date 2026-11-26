// Modèles de diapositives HydroGrow, d'après la charte graphique v2.
// Chaque modèle décrit ses champs (pour l'éditeur) et produit le HTML d'une diapo
// à la taille réelle. Le même code sert à l'aperçu du studio et à l'export PNG.

export const FORMATS = {
  portrait: { l: 1080, h: 1350, nom: "Post 4:5 · 1080 × 1350" },
  carre: { l: 1080, h: 1080, nom: "Carré · 1080 × 1080" },
  story: { l: 1080, h: 1920, nom: "Story · 1080 × 1920" },
};

export const FONDS = {
  nuit: "Nuit marine (par défaut)",
  profond: "Bleu profond",
  bleu: "Bleu vif (bannière)",
  brume: "Brume (fond clair)",
};

const CERCLES = {
  "haut-droite": "En haut à droite",
  "haut-gauche": "En haut à gauche",
  centre: "Au centre",
  "bas-droite": "En bas à droite",
  aucun: "Aucun",
};

// Icônes : traits arrondis de 1,8 px sur une grille de 24 px (charte, planche 13)
export const ICONES = {
  pousse: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 8-7 0 4.5-3 7-8 7z"/><path d="M12 14c0-3.3-2.5-6-6.5-6 0 3.6 2.5 6 6.5 6z"/>',
  goutte: '<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/>',
  ph: '<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
  ec: '<path d="M13 3 5 13.5h6L10 21l9-11h-6z"/>',
  temperature: '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 11v6"/>',
  niveau: '<path d="M5 4v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4"/><path d="M5 12c2.3-1.6 4.7-1.6 7 0s4.7 1.6 7 0"/>',
  soleil: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/>',
  cube: '<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
  communaute: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2a4.5 4.5 0 0 1 4.5 4.8"/>',
  profil: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  courbe: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-6"/>',
  wifi: '<path d="M2.5 9a14 14 0 0 1 19 0"/><path d="M5.5 12.5a9.5 9.5 0 0 1 13 0"/><path d="M8.7 16a5 5 0 0 1 6.6 0"/><path d="M12 19.5h.01"/>',
  cloche: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  horloge: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  valide: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16 10"/>',
  boitier: '<rect x="6" y="6" width="12" height="12" rx="2.5"/><path d="M9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3"/>',
  idee: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  ville: '<path d="M3 21h18M5 21V8l5-3v16M10 21V10h9v11"/><path d="M13 13h3M13 16.5h3"/>',
  calendrier: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  recolte: '<path d="M4 10h16l-1.6 9a2 2 0 0 1-2 1.6H7.6a2 2 0 0 1-2-1.6z"/><path d="M8.5 10 12 4l3.5 6"/>',
};

const icone = (cle, cls = "") =>
  ICONES[cle]
    ? `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONES[cle]}</svg>`
    : "";

// ---------- Texte ----------

const echapper = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Typographie française : apostrophe courbe, espaces insécables avant : ; ! ? » et après «
export function typo(s) {
  return String(s ?? "")
    .replace(/([\p{L}\d])'(\p{L})/gu, "$1’$2")
    .replace(/ +([:;!?»%])/g, (m, c) => (c === ":" || c === "%" ? " " : " ") + c)
    .replace(/« +/g, "« ")
    .replace(/(\d) (\d{3})\b/g, "$1 $2")
    .replace(/(\d) (°C|°|cm|mm|kg|g|L|mL|ml|h|min|j|€)(?=\W|$)/g, "$1 $2");
}

// *mot* = accent vert pousse (à garder rare), retour à la ligne = saut de ligne
export function riche(s) {
  return typo(echapper(s))
    .replace(/\*([^*]+)\*/g, "<i>$1</i>")
    .replace(/\n/g, "<br>");
}

const lignes = (s) =>
  String(s ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
const paire = (l) => {
  const [a, ...b] = l.split("|");
  return [a.trim(), b.join("|").trim()];
};

// ---------- Éléments communs ----------

export function cerclesSvg(position, f) {
  if (!position || position === "aucun") return "";
  const { l, h } = f;
  const [x, y] = {
    "haut-droite": [l - 70, 190],
    "haut-gauche": [70, 190],
    centre: [l / 2, Math.round(h * 0.27)],
    "bas-droite": [l - 70, h - 330],
  }[position] ?? [l - 70, 190];
  const rayons = [110, 200, 300, 410, 530];
  return `<svg class="hg-deco" viewBox="0 0 ${l} ${h}">${rayons
    .map((r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="var(--cercle)" stroke-width="2"/>`)
    .join("")}<circle cx="${x}" cy="${y}" r="26" fill="var(--point)"/></svg>`;
}

const LOGO_FOND = { nuit: "sombre", profond: "sombre", bleu: "bleu", brume: "clair", photo: "sombre" };
const logo = (ctx, fond, cls = "hg-logo") => {
  const src = ctx.logos?.[LOGO_FOND[fond] ?? "sombre"];
  return src ? `<img class="${cls}" src="${src}" alt="">` : `<b class="${cls}">hydrogrow</b>`;
};

function pied(ctx, fond, avecLogo = true) {
  const mode = ctx.pied ?? "pagination";
  if (mode === "aucun") return "";
  let droite = "";
  if (mode === "pagination" && ctx.total > 1)
    droite = `${ctx.page} / ${ctx.total}${ctx.page < ctx.total ? " &nbsp;→" : ""}`;
  else if (mode !== "logo") droite = echapper(ctx.site ?? "hydrogrow.fr");
  // Logo déjà en haut de la diapo : on ne le répète pas en bas
  if (!avecLogo && !droite) return "";
  return `<footer class="hg-pied">${avecLogo ? logo(ctx, fond) : "<span></span>"}<span>${droite}</span></footer>`;
}

const sur = (s) => (s ? `<p class="hg-sur">${riche(s)}</p>` : "");
const texte = (s, cls = "hg-texte") => (s ? `<p class="${cls}">${riche(s)}</p>` : "");
// Le grand titre réduit sa taille quand il est long, pour rester lisible
const grandTitre = (t) => {
  const n = String(t ?? "").replace(/\*/g, "").length;
  return `<h1 class="${n > 50 ? "hg-tres-long" : n > 30 ? "hg-long" : ""}">${riche(t)}</h1>`;
};
const pastille = (s) => (s ? `<p class="hg-pastille">${riche(s)}</p>` : "");

function cadre(d, ctx, { fond, deco = "", corps, placement = "bas", entete = "", classe = "" }) {
  return `<div class="hg ${classe}" data-fond="${fond}" data-format="${ctx.format}" style="width:${ctx.f.l}px;height:${ctx.f.h}px">
${deco}<div class="hg-cadre">${entete}<div class="hg-corps hg-${placement}">${corps}</div>${pied(ctx, fond, !entete)}</div></div>`;
}

// Champs réutilisés
const C = {
  fond: { id: "fond", label: "Fond", type: "choix", options: FONDS, defaut: "nuit" },
  cercles: (defaut = "haut-droite") => ({ id: "cercles", label: "Cercles concentriques", type: "choix", options: CERCLES, defaut }),
  sur: (defaut = "") => ({ id: "sur", label: "Sur-titre", type: "texte", defaut, aide: "Petite ligne en capitales au-dessus du titre." }),
  titre: (defaut) => ({ id: "titre", label: "Titre", type: "zone", defaut, aide: "*mot* pour l'accent vert. Entrée pour aller à la ligne." }),
  texte: (defaut = "") => ({ id: "texte", label: "Texte", type: "zone", defaut }),
  pastille: (defaut = "") => ({ id: "pastille", label: "Pastille", type: "texte", defaut, aide: "Bouton vert : appel à l'action ou slogan." }),
  image: (defaut = "/images/video/video-thum.webp") => ({ id: "image", label: "Photo", type: "image", defaut }),
  posX: { id: "posX", label: "Cadrage horizontal", type: "curseur", defaut: 50 },
  posY: { id: "posY", label: "Cadrage vertical", type: "curseur", defaut: 50 },
  zoom: { id: "zoom", label: "Zoom", type: "curseur", min: 100, max: 200, defaut: 100 },
  icone: (defaut = "pousse") => ({ id: "icone", label: "Icône", type: "icone", defaut }),
};

const photo = (d) =>
  `<div class="hg-photo" style="background-image:url('${encodeURI(d.image ?? "")}');background-position:${d.posX ?? 50}% ${d.posY ?? 50}%;background-size:${(d.zoom ?? 100) > 100 ? `${d.zoom}% auto` : "cover"}"></div>`;

// ---------- Modèles ----------

export const MODELES = {
  "couverture-photo": {
    nom: "Couverture photo",
    groupe: "Couvertures",
    description: "Photo plein cadre, voile sombre, gros titre. Première diapo d'un carrousel.",
    champs: [
      C.image("/images/blog/hydroponie-donnees.webp"),
      C.posX,
      C.posY,
      C.zoom,
      { id: "voile", label: "Voile", type: "choix", options: { leger: "Léger", normal: "Normal", fort: "Fort" }, defaut: "normal" },
      { id: "logoHaut", label: "Logo en haut", type: "case", defaut: false },
      C.sur("Guide hydroponie"),
      C.titre("*5 données*\nà surveiller"),
      C.texte("Pour garder un œil sur les racines et sur le climat autour de la plante."),
      C.pastille(),
    ],
    rendu: (d, ctx) =>
      cadre(d, ctx, {
        fond: "photo",
        classe: `hg-voile-${d.voile ?? "normal"}`,
        deco: `${photo(d)}<div class="hg-voile"></div>`,
        entete: d.logoHaut ? `<header class="hg-entete">${logo(ctx, "photo")}</header>` : "",
        corps: `${sur(d.sur)}${grandTitre(d.titre)}${texte(d.texte)}${pastille(d.pastille)}`,
      }),
  },

  couverture: {
    nom: "Couverture signal",
    groupe: "Couvertures",
    description: "Fond uni et cercles concentriques. Annonce, titre fort, bannière.",
    champs: [
      C.fond,
      C.cercles("haut-droite"),
      { id: "alignement", label: "Alignement", type: "choix", options: { gauche: "À gauche, en bas", centre: "Centré" }, defaut: "gauche" },
      { id: "logoHaut", label: "Logo en haut", type: "case", defaut: true },
      C.sur("Les coulisses"),
      C.titre("L'avenir\nest *local.*"),
      C.texte("Cultivez-le avec HydroGrow."),
      C.pastille("Planter. Connecter. Savourer."),
    ],
    rendu: (d, ctx) =>
      cadre(d, ctx, {
        fond: d.fond,
        deco: cerclesSvg(d.cercles, ctx.f),
        placement: d.alignement === "centre" ? "centre" : "bas",
        classe: d.alignement === "centre" ? "hg-centre-texte" : "",
        entete: d.logoHaut ? `<header class="hg-entete">${logo(ctx, d.fond)}</header>` : "",
        corps: `${sur(d.sur)}${grandTitre(d.titre)}${texte(d.texte)}${pastille(d.pastille)}`,
      }),
  },

  fiche: {
    nom: "Fiche",
    groupe: "Contenu",
    description: "Icône, titre, texte et cartes. Une notion par diapo.",
    champs: [
      C.fond,
      C.cercles("haut-droite"),
      C.sur("Donnée 1 sur 5"),
      C.icone("ph"),
      C.titre("Le pH"),
      C.texte("L'acidité de la solution nutritive. Il influence la disponibilité des nutriments."),
      {
        id: "cartes",
        label: "Cartes",
        type: "zone",
        defaut: "La question | Les éléments restent-ils accessibles à la plante ?\nEn cas d'écart, vérifiez | L'étalonnage de la sonde et l'eau ajoutée.",
        aide: "Une carte par ligne : Étiquette | texte",
      },
    ],
    rendu: (d, ctx) =>
      cadre(d, ctx, {
        fond: d.fond,
        deco: cerclesSvg(d.cercles, ctx.f),
        placement: "haut",
        corps: `${sur(d.sur)}${d.icone ? `<div class="hg-tuile">${icone(d.icone)}</div>` : ""}<h2>${riche(d.titre)}</h2>${texte(d.texte)}${lignes(d.cartes)
          .map(paire)
          .map(([a, b]) => `<div class="hg-carte">${a ? `<b>${riche(a)}</b>` : ""}<p>${riche(b || "")}</p></div>`)
          .join("")}`,
      }),
  },

  liste: {
    nom: "Liste en cartes",
    groupe: "Contenu",
    description: "Blocs de lignes « nom · état ». Avancement, comparatif, inventaire.",
    champs: [
      C.fond,
      C.cercles("haut-droite"),
      C.sur("Les coulisses"),
      C.titre("Où en est\n*HydroGrow* ?"),
      C.texte("Né en 2023 d'un logiciel de gestion d'hydroponie, devenu un projet mené en équipe."),
      {
        id: "blocs",
        label: "Blocs",
        type: "zone",
        defaut: "## Testé sur la première version\nTempérature de l'eau | Capteur\nNiveau d'eau | Capteur\n## Au programme\nSondes pH et EC | Dans les packs",
        aide: "« ## Titre » ouvre un bloc, puis une ligne par élément : nom | état",
      },
    ],
    rendu: (d, ctx) => {
      const blocs = [];
      for (const l of lignes(d.blocs)) {
        if (l.startsWith("#")) blocs.push({ t: l.replace(/^#+\s*/, ""), l: [] });
        else (blocs.at(-1) ?? (blocs.push({ t: "", l: [] }), blocs[0])).l.push(paire(l));
      }
      return cadre(d, ctx, {
        fond: d.fond,
        deco: cerclesSvg(d.cercles, ctx.f),
        placement: "haut",
        classe: "hg-serre",
        corps: `${sur(d.sur)}<h2>${riche(d.titre)}</h2>${texte(d.texte)}${blocs
          .map(
            (b) =>
              `<div class="hg-carte">${b.t ? `<b>${riche(b.t)}</b>` : ""}<ul>${b.l
                .map(([n, e]) => `<li><span>${riche(n)}</span><em>${riche(e)}</em></li>`)
                .join("")}</ul></div>`,
          )
          .join("")}`,
      });
    },
  },

  chiffre: {
    nom: "Chiffre clé",
    groupe: "Contenu",
    description: "Un chiffre en très grand, en vert pousse. Stat, repère, mesure.",
    champs: [
      C.fond,
      C.cercles("haut-droite"),
      C.sur("Le bon repère"),
      { id: "chiffre", label: "Chiffre", type: "texte", defaut: "5,5 à 6,5" },
      { id: "unite", label: "Unité", type: "texte", defaut: "pH" },
      C.titre("La plage où la plupart des légumes-feuilles se sentent bien."),
      C.texte("Quelques dixièmes de plus ou de moins suffisent à bloquer certains nutriments."),
      { id: "source", label: "Source", type: "texte", defaut: "", aide: "Facultatif, en petit en bas." },
    ],
    rendu: (d, ctx) =>
      cadre(d, ctx, {
        fond: d.fond,
        deco: cerclesSvg(d.cercles, ctx.f),
        placement: "bas",
        corps: `${sur(d.sur)}<p class="hg-chiffre${String(d.chiffre ?? "").length > 6 ? " hg-long" : ""}">${riche(d.chiffre)}${d.unite ? `<small>${riche(d.unite)}</small>` : ""}</p><h3>${riche(d.titre)}</h3>${texte(d.texte)}${d.source ? `<p class="hg-source">Source : ${riche(d.source)}</p>` : ""}`,
      }),
  },

  etapes: {
    nom: "Étapes",
    groupe: "Contenu",
    description: "Une marche à suivre numérotée. Routine, tutoriel, check-list.",
    champs: [
      C.fond,
      C.cercles("aucun"),
      C.sur("La routine"),
      C.titre("Le relevé\nen *3 gestes*"),
      {
        id: "etapes",
        label: "Étapes",
        type: "zone",
        defaut: "Mesurer | pH, EC et température, toujours à la même heure.\nNoter | Les valeurs, l'eau ajoutée et chaque intervention.\nComparer | Avec la plage fixée pour cette culture.",
        aide: "Une étape par ligne : Titre | détail",
      },
    ],
    rendu: (d, ctx) =>
      cadre(d, ctx, {
        fond: d.fond,
        deco: cerclesSvg(d.cercles, ctx.f),
        placement: "haut",
        corps: `${sur(d.sur)}<h2>${riche(d.titre)}</h2><ol class="hg-etapes">${lignes(d.etapes)
          .map(paire)
          .map(([a, b], i) => `<li><span class="hg-num">${i + 1}</span><div><b>${riche(a)}</b>${b ? `<p>${riche(b)}</p>` : ""}</div></li>`)
          .join("")}</ol>`,
      }),
  },

  duo: {
    nom: "Comparaison",
    groupe: "Contenu",
    description: "Deux colonnes : avant / après, on dit / on évite, manuel / connecté.",
    champs: [
      C.fond,
      C.cercles("aucun"),
      C.sur("Le comparatif"),
      C.titre("Minuteur\nou *capteurs* ?"),
      { id: "gauche", label: "Colonne de gauche", type: "texte", defaut: "Un minuteur" },
      { id: "pointsGauche", label: "Points de gauche", type: "zone", defaut: "Arrose à heure fixe\nIgnore la chaleur\nNe prévient pas", aide: "Un point par ligne" },
      { id: "droite", label: "Colonne de droite (mise en avant)", type: "texte", defaut: "Des capteurs" },
      { id: "pointsDroite", label: "Points de droite", type: "zone", defaut: "S'adapte à la plante\nSuit l'eau et l'air\nVous prévient à temps" },
    ],
    rendu: (d, ctx) => {
      const col = (t, p, cls) =>
        `<div class="hg-col ${cls}"><b>${riche(t)}</b><ul>${lignes(p)
          .map((x) => `<li>${riche(x)}</li>`)
          .join("")}</ul></div>`;
      return cadre(d, ctx, {
        fond: d.fond,
        deco: cerclesSvg(d.cercles, ctx.f),
        placement: "haut",
        corps: `${sur(d.sur)}<h2>${riche(d.titre)}</h2><div class="hg-duo">${col(d.gauche, d.pointsGauche, "")}${col(d.droite, d.pointsDroite, "hg-mise")}</div>`,
      });
    },
  },

  citation: {
    nom: "Citation",
    groupe: "Contenu",
    description: "Une phrase forte, une personne. Témoignage, parole d'équipe.",
    champs: [
      C.fond,
      C.cercles("bas-droite"),
      C.sur("La parole à l'équipe"),
      { id: "citation", label: "Citation", type: "zone", defaut: "Une valeur affichée n'est utile que si l'on peut lui faire *confiance*." },
      { id: "auteur", label: "Auteur", type: "texte", defaut: "Équipe HydroGrow" },
      { id: "role", label: "Rôle", type: "texte", defaut: "Projet Ydays" },
      { id: "portrait", label: "Portrait (facultatif)", type: "image", defaut: "" },
    ],
    rendu: (d, ctx) =>
      cadre(d, ctx, {
        fond: d.fond,
        deco: cerclesSvg(d.cercles, ctx.f),
        placement: "centre",
        corps: `${sur(d.sur)}<p class="hg-guillemet">«</p><blockquote>${riche(d.citation)}</blockquote><div class="hg-auteur">${d.portrait ? `<span class="hg-portrait" style="background-image:url('${encodeURI(d.portrait)}')"></span>` : ""}<div><b>${riche(d.auteur)}</b>${d.role ? `<span>${riche(d.role)}</span>` : ""}</div></div>`,
      }),
  },

  app: {
    nom: "Écran d'app",
    groupe: "Produit",
    description: "Carte de parcelle avec badge d'état et trois mesures, comme dans l'app.",
    champs: [
      C.fond,
      C.cercles("haut-droite"),
      C.sur("Dans l'application"),
      C.titre("Votre jardin\nva *bien* aujourd'hui."),
      C.texte("Les mesures clés de chaque parcelle, d'un coup d'œil."),
      { id: "parcelle", label: "Nom de la carte", type: "texte", defaut: "Parcelle · Basilic" },
      { id: "badge", label: "Badge d'état", type: "choix", options: { optimal: "Optimal", attention: "Attention", alerte: "Alerte", aucun: "Aucun" }, defaut: "optimal" },
      { id: "mesures", label: "Mesures", type: "zone", defaut: "6,0 | pH\n82 % | Eau\n22 °C | Air", aide: "Une mesure par ligne : valeur | libellé (3 idéalement)" },
      { id: "jauge", label: "Jauge (facultatif)", type: "texte", defaut: "Niveau d'eau | 82", aide: "Libellé | pourcentage" },
    ],
    rendu: (d, ctx) => {
      const badges = { optimal: "Optimal", attention: "Attention", alerte: "Alerte" };
      const [jl, jv] = d.jauge ? paire(d.jauge) : ["", ""];
      const pct = Math.max(0, Math.min(100, parseFloat(String(jv).replace(",", ".")) || 0));
      return cadre(d, ctx, {
        fond: d.fond,
        deco: cerclesSvg(d.cercles, ctx.f),
        placement: "haut",
        corps: `${sur(d.sur)}<h2>${riche(d.titre)}</h2>${texte(d.texte)}<div class="hg-carte hg-app"><div class="hg-app-tete"><b>${riche(d.parcelle)}</b>${badges[d.badge] ? `<span class="hg-badge hg-badge-${d.badge}">${badges[d.badge]}</span>` : ""}</div><div class="hg-mesures">${lignes(d.mesures)
          .map(paire)
          .map(([v, l]) => `<div><strong>${riche(v)}</strong><span>${riche(l)}</span></div>`)
          .join("")}</div>${jl ? `<div class="hg-jauge"><div class="hg-jauge-l"><span>${riche(jl)}</span><span>${typo(`${pct} %`)}</span></div><div class="hg-jauge-b"><i style="width:${pct}%"></i></div></div>` : ""}</div>`,
      });
    },
  },

  notifications: {
    nom: "Notifications",
    groupe: "Produit",
    description: "Des notifications calmes de l'app. Montrer l'alerte sans dramatiser.",
    champs: [
      C.fond,
      C.cercles("haut-droite"),
      C.sur("Alertes"),
      C.titre("Prévenu à temps,\n*jamais* affolé."),
      C.texte("HydroGrow vous écrit quand une mesure sort de sa plage. Simplement."),
      {
        id: "notifs",
        label: "Notifications",
        type: "zone",
        defaut: "Réservoir bas : 30 % | Pensez à faire l'appoint avant ce soir. | maintenant\nVotre basilic est prêt | Bonne récolte ! | il y a 2 h",
        aide: "Une par ligne : titre | message | moment",
      },
    ],
    rendu: (d, ctx) =>
      cadre(d, ctx, {
        fond: d.fond,
        deco: cerclesSvg(d.cercles, ctx.f),
        placement: "haut",
        corps: `${sur(d.sur)}<h2>${riche(d.titre)}</h2>${texte(d.texte)}<div class="hg-notifs">${lignes(d.notifs)
          .map((l) => l.split("|").map((x) => x.trim()))
          .map(
            ([t, m, q]) =>
              `<div class="hg-notif"><span class="hg-notif-ic">${ctx.icone ? `<img src="${ctx.icone}" alt="">` : ""}</span><div><small>HydroGrow · ${riche(q || "maintenant")}</small><b>${riche(t)}</b>${m ? `<p>${riche(m)}</p>` : ""}</div></div>`,
          )
          .join("")}</div>`,
      }),
  },

  photo: {
    nom: "Photo",
    groupe: "Photo",
    description: "Une photo seule, une légende courte. Coulisses, culture, récolte.",
    champs: [C.image("/images/blog/hydroponie-ph.webp"), C.posX, C.posY, C.zoom, { id: "legende", label: "Légende", type: "texte", defaut: "Basilic, jour 21." }, { id: "logo", label: "Logo en bas", type: "case", defaut: true }],
    rendu: (d, ctx) =>
      `<div class="hg hg-plein" data-fond="photo" data-format="${ctx.format}" style="width:${ctx.f.l}px;height:${ctx.f.h}px">${photo(d)}<div class="hg-voile-bas"></div><div class="hg-cadre"><div class="hg-corps hg-bas">${d.legende ? `<p class="hg-etiquette">${riche(d.legende)}</p>` : ""}</div>${d.logo ? pied(ctx, "photo") : ""}</div></div>`,
  },

  fin: {
    nom: "Fin / appel à l'action",
    groupe: "Couvertures",
    description: "Dernière diapo : message, pastille et lien. Cercles centrés.",
    champs: [
      C.fond,
      C.cercles("centre"),
      C.titre("La valeur vient\ndes *liens*\nentre les mesures."),
      C.texte("Enregistrez ce post pour votre prochain relevé."),
      C.pastille("Le guide complet : hydrogrow.fr"),
    ],
    rendu: (d, ctx) =>
      cadre(d, ctx, {
        fond: d.fond,
        deco: cerclesSvg(d.cercles, ctx.f),
        placement: "fin",
        classe: "hg-centre-texte",
        corps: `<h2>${riche(d.titre)}</h2>${texte(d.texte)}${pastille(d.pastille)}`,
      }),
  },
};

export function valeursParDefaut(modele) {
  return Object.fromEntries(MODELES[modele].champs.map((c) => [c.id, c.defaut]));
}

// Rend une diapo. ctx = { format, logos, icone, pied, site, page, total }
export function rendreDiapo(diapo, ctx) {
  const m = MODELES[diapo.modele] ?? MODELES.couverture;
  const f = FORMATS[ctx.format] ?? FORMATS.portrait;
  const d = { ...valeursParDefaut(diapo.modele in MODELES ? diapo.modele : "couverture"), ...diapo.champs };
  return m.rendu(d, { ...ctx, f });
}

// Variantes du logotype d'après la charte (planche 08) :
// sombre = hydro brume + grow vert ; clair = texte nuit marine ; bleu = texte brume.
export function variantesLogo(svg) {
  const i = svg.indexOf("<g transform");
  const symbole = svg.slice(0, i);
  const texteLogo = svg.slice(i);
  const teinte = (c) => symbole + texteLogo.replace(/fill="#(EAF3EE|5BE3A8)"/g, `fill="${c}"`);
  const url = (s) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
  return { sombre: url(svg), clair: url(teinte("#08172B")), bleu: url(teinte("#EAF3EE")) };
}

// Identifiant stable d'une diapo : il permet à plusieurs éditeurs (vous, une IA) de modifier
// le même projet en même temps sans se marcher dessus, même si l'ordre change.
export const nouvelId = () => Math.random().toString(36).slice(2, 10);
