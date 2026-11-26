import { FORMATS, ICONES, MODELES, nouvelId, rendreDiapo, valeursParDefaut } from "./modeles.js";
import { chargerMarque } from "./marque.js";
import { APPELS, EXEMPLE_PLAN, HASHTAGS, altAuto, depuisArticle, depuisPlan, diapo, legendeDepuisDiapos, verifier } from "./auto.js";
import { appliquer, assurerIds, difference } from "./operations.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const svgIcone = (cle) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONES[cle] ?? ""}</svg>`;

const marque = await chargerMarque();
let projet = null;
let courant = 0;
let debordements = new Set();
let historique = [], futur = [], dernierInstantane = 0;

// ---------- Utilitaires ----------

function toast(texte, action = null, duree = 2400) {
  const t = $("#toast");
  t.innerHTML = `<span>${esc(texte)}</span>${action ? `<button class="btn">${esc(action.libelle)}</button>` : ""}`;
  if (action) $("button", t).onclick = () => ((t.hidden = true), action.fn());
  t.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (t.hidden = true), duree);
}

async function api(chemin, options = {}) {
  const r = await fetch(`/api/${chemin}`, { cache: "no-store", ...options });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.erreur ?? `Erreur ${r.status}`);
  return data;
}

const ctxDiapo = (p, i) => ({ ...marque, format: p.format ?? "portrait", pied: p.pied ?? "pagination", site: p.site ?? "hydrogrow.fr", page: i + 1, total: p.diapos.length });

// Vignette : la diapo à taille réelle, réduite par transform
function vignette(p, i, largeur) {
  const f = FORMATS[p.format ?? "portrait"];
  const s = largeur / f.l;
  return `<div class="vignette" style="width:${largeur}px;height:${Math.round(f.h * s)}px"><div class="echelle" style="transform:scale(${s})">${rendreDiapo(p.diapos[i], ctxDiapo(p, i))}</div></div>`;
}

function ouvrirModale(titre, html, { large = true } = {}) {
  const m = $("#modale");
  $("#modale-titre").textContent = titre;
  $("#modale-corps").innerHTML = html;
  m.style.width = large ? "" : "min(560px, calc(100vw - 48px))";
  if (!m.open) m.showModal();
  return $("#modale-corps");
}
const fermerModale = () => $("#modale").close();
$("#modale").addEventListener("click", (e) => { if (e.target.id === "modale") fermerModale(); });

function slugifier(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/^(.{0,50})(-.*)?$/, "$1") || "post";
}

// ---------- Sauvegarde, synchronisation et historique ----------
// Le studio n'envoie que ses changements (opérations) : une IA ou un autre onglet peut
// modifier le même projet en même temps, le serveur fusionne et prévient tout le monde.

const CLIENT = Math.random().toString(36).slice(2, 10); // identifie cet onglet
let base = null; // dernière version connue du serveur
let file = Promise.resolve(); // les échanges avec le serveur passent un par un
const enFile = (fn) => (file = file.then(fn, fn));
const heure = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

let minuterieSauvegarde;
function sauverPlusTard() {
  $("#etat").textContent = "Modifications non enregistrées…";
  clearTimeout(minuterieSauvegarde);
  minuterieSauvegarde = setTimeout(sauver, 500);
}
function sauver() {
  clearTimeout(minuterieSauvegarde);
  return enFile(async () => {
    if (!projet || !base) return;
    const envoye = structuredClone(projet);
    const ops = difference(base, envoye);
    if (!ops.length) return ($("#etat").textContent = `Enregistré · ${heure()}`);
    try {
      const r = await api(`projets/${projet.slug}/operations`, { method: "POST", body: JSON.stringify({ ops, auteur: "humain", source: CLIENT }) });
      integrer(r.projet, envoye);
      $("#etat").textContent = `Enregistré · ${heure()}`;
    } catch (e) {
      $("#etat").textContent = `Échec de l'enregistrement : ${e.message}`;
    }
  });
}

// Intègre une version du serveur en gardant les changements locaux pas encore envoyés.
// ref = l'état à partir duquel les changements locaux sont comptés.
function integrer(serveur, ref) {
  const distantes = difference(ref, serveur);
  const locales = difference(ref, projet);
  const idCourant = projet.diapos[courant]?.id;
  base = serveur;
  projet = appliquer(serveur, locales);
  if (!distantes.length) return [];
  // L'annulation ne doit pas défaire le travail des autres : on rejoue leurs changements dans l'historique
  const rejouer = (s) => JSON.stringify(appliquer(JSON.parse(s), distantes));
  historique = historique.map(rejouer);
  futur = futur.map(rejouer);
  const i = projet.diapos.findIndex((d) => d.id === idCourant);
  courant = i >= 0 ? i : Math.max(0, Math.min(courant, projet.diapos.length - 1));
  rafraichir({ inspecteur: true, entete: true, garderFocus: true });
  return distantes;
}

// Toute modification passe par ici : instantané pour l'annulation, sauvegarde, rafraîchissement
function modifier(fn, { inspecteur = false } = {}) {
  const maintenant = Date.now();
  if (maintenant - dernierInstantane > 800) {
    historique.push(JSON.stringify(projet));
    if (historique.length > 100) historique.shift();
    futur = [];
  }
  dernierInstantane = maintenant;
  fn();
  courant = Math.max(0, Math.min(courant, projet.diapos.length - 1));
  sauverPlusTard();
  rafraichir({ inspecteur });
  signalerPlusTard();
}
function annuler() {
  if (!historique.length) return;
  futur.push(JSON.stringify(projet));
  projet = JSON.parse(historique.pop());
  dernierInstantane = 0;
  courant = Math.min(courant, projet.diapos.length - 1);
  sauverPlusTard();
  rafraichir({ inspecteur: true, entete: true });
}
function retablir() {
  if (!futur.length) return;
  historique.push(JSON.stringify(projet));
  projet = JSON.parse(futur.pop());
  dernierInstantane = 0;
  sauverPlusTard();
  rafraichir({ inspecteur: true, entete: true });
}

// ---------- Présence : ce que vous regardez, ce que font les IA ----------

let presences = [];
let ongletActif = "diapo";
let champActif = null;
function signaler() {
  const d = projet?.diapos[courant];
  fetch("/api/presence", {
    method: "POST",
    body: JSON.stringify({ qui: "humain", ia: false, projet: projet?.slug ?? null, diapo: d?.id ?? null, numero: projet ? courant + 1 : null, onglet: projet ? ongletActif : "accueil", champ: champActif }),
  }).catch(() => {});
}
let minuteriePresence;
const signalerPlusTard = () => (clearTimeout(minuteriePresence), (minuteriePresence = setTimeout(signaler, 400)));
setInterval(signaler, 45000);
document.addEventListener("focusin", (e) => {
  const c = e.target.dataset?.champ ?? (e.target.matches?.("[data-alt]") ? "alt" : e.target.id === "legende" ? "legende" : null);
  if (c !== champActif) (champActif = c), signalerPlusTard();
});

const NOMS = { humain: "Vous", fichier: "Fichier modifié", inconnu: "Quelqu'un" };
const nom = (a) => NOMS[a] ?? a;
const activite = [];
function journal(entree) {
  activite.unshift({ ...entree, quand: Date.now() });
  activite.length = Math.min(activite.length, 50);
  if (!$("#onglet-activite").hidden) rendreActivite();
  else {
    const n = $("#nbactivite");
    n.textContent = String((Number(n.textContent) || 0) + 1);
  }
}

const DESCRIPTION_OP = {
  projet: (o) => `${o.champ} du projet`,
  legende: () => "légende",
  hashtags: () => "hashtags",
  champ: (o) => `« ${o.champ} »`,
  champs: (o) => Object.keys(o.valeurs ?? {}).map((k) => `« ${k} »`).join(", "),
  alt: () => "texte alternatif",
  modele: (o) => `modèle → ${MODELES[o.modele]?.nom ?? o.modele}`,
  ajouter: (o) => `ajout d'une diapo ${MODELES[o.modele]?.nom ?? ""}`,
  plan: () => "ajout de diapos depuis un plan",
  supprimer: () => "suppression d'une diapo",
  deplacer: () => "déplacement d'une diapo",
  ordre: () => "nouvel ordre des diapos",
};

function rendreActivite() {
  $("#nbactivite").textContent = "";
  const num = (id) => {
    const i = projet?.diapos.findIndex((d) => d.id === id);
    return i >= 0 ? i + 1 : null;
  };
  $("#onglet-activite").innerHTML = `
    <p class="aide-onglet">Ce que les autres éditeurs (une IA, un autre onglet) changent dans le projet, en direct. Une IA connectée au studio apparaît en haut de l'écran.</p>
    ${presences.filter((p) => p.ia).length ? "" : `<p class="vide">Aucune IA connectée. Voir <code>instagram/studio/IA.md</code>.</p>`}
    ${activite.length ? `<ul class="journal">${activite
      .map((a) => {
        const details = (a.ops ?? []).map((o) => {
          const n = num(o.diapo ?? o.id);
          return `<li${n ? ` data-aller="${n - 1}"` : ""}>${n ? `Diapo ${n} : ` : ""}${esc((DESCRIPTION_OP[o.op] ?? (() => o.op))(o))}</li>`;
        });
        return `<li><div><b>${esc(nom(a.auteur))}</b><time>${new Date(a.quand).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</time></div><p>${esc(a.texte ?? "")}</p>${details.length ? `<ul>${details.slice(0, 12).join("")}${details.length > 12 ? `<li>… et ${details.length - 12} de plus</li>` : ""}</ul>` : ""}</li>`;
      })
      .join("")}</ul>` : ""}`;
}

function rendrePresences() {
  const ia = presences.filter((p) => p.ia);
  $("#presences").innerHTML = ia
    .map((p) => {
      const ici = projet && p.projet === projet.slug;
      const n = ici && p.diapo ? projet.diapos.findIndex((d) => d.id === p.diapo) + 1 : 0;
      const ou = n ? ` · diapo ${n}` : p.projet && !ici ? ` · sur « ${p.projet} »` : "";
      return `<span class="presence" title="${esc(p.activite || "Connecté au studio")}"><i></i><b>${esc(p.qui)}</b><span>${esc(p.activite ? ` · ${p.activite}` : "")}${esc(ou)}</span></span>`;
    })
    .join("");
  // Repère sur la vignette où travaille une IA
  $$("#liste li").forEach((li) => {
    const p = ia.find((x) => x.projet === projet?.slug && x.diapo === li.dataset.id);
    li.classList.toggle("ia-ici", !!p);
    if (p) li.dataset.qui = p.qui;
  });
}

function ecouter() {
  const es = new EventSource("/api/evenements");
  let rafraichirAccueil;
  es.onmessage = (m) => {
    const e = JSON.parse(m.data);
    if (e.type === "presence") return (presences = e.presences), rendrePresences();
    if (e.type === "message") {
      journal({ auteur: e.auteur, texte: e.texte });
      return toast(`${nom(e.auteur)} : ${e.texte}`, e.projet && e.projet !== projet?.slug ? { libelle: "Ouvrir", fn: () => ouvrir(e.projet) } : null, 8000);
    }
    if (e.type === "nouveau" && e.auteur !== "humain") {
      journal({ auteur: e.auteur, texte: `a créé le projet « ${e.titre} »` });
      toast(`${nom(e.auteur)} a créé « ${e.titre} »`, { libelle: "Ouvrir", fn: () => ouvrir(e.slug) }, 8000);
    }
    if (!projet) {
      // Accueil : la liste suit les créations et modifications des autres
      clearTimeout(rafraichirAccueil);
      rafraichirAccueil = setTimeout(() => !projet && !$("#accueil").hidden && accueil(), 300);
      return;
    }
    if (e.slug !== projet.slug) return;
    if (e.type === "supprime") {
      toast("Ce projet a été supprimé ailleurs.");
      projet = null;
      return accueil();
    }
    if (e.type === "projet" && e.source !== CLIENT) {
      enFile(async () => {
        const serveur = await api(`projets/${e.slug}`).catch(() => null);
        if (!serveur || !projet || serveur.slug !== projet.slug) return;
        const distantes = integrer(serveur, base);
        if (!distantes.length) return;
        const touchees = new Set(distantes.map((o) => o.diapo ?? o.id).filter(Boolean));
        $$("#liste li").forEach((li) => touchees.has(li.dataset.id) && li.classList.add("ia-modif"));
        journal({ auteur: e.auteur, texte: e.message || "a modifié le projet.", ops: distantes });
        if (e.auteur !== "humain") toast(`${nom(e.auteur)} : ${e.message || "projet modifié"}`, null, 4000);
      });
    }
  };
}

// ---------- Accueil ----------

let filtreStatut = "tous";
const STATUTS = { idee: "Idée", brouillon: "Brouillon", pret: "Prêt", publie: "Publié" };

async function accueil() {
  if (projet) await sauver();
  projet = null;
  base = null;
  history.replaceState(null, "", "/");
  document.title = "Studio Instagram · HydroGrow";
  $("#editeur").hidden = true;
  $(".barre-projet").hidden = true;
  $('[data-action="exporter"]').hidden = true;
  $("#etat").textContent = "";
  const el = $("#accueil");
  if (el.hidden || !el.innerHTML.trim()) el.innerHTML = `<p class="charge">Chargement des projets…</p>`;
  el.hidden = false;
  signalerPlusTard();
  rendrePresences();
  const liste = await api("projets");
  liste.sort((a, b) => (b.date || "9999").localeCompare(a.date || "9999") || a.slug.localeCompare(b.slug, "fr", { numeric: true }));
  const visibles = liste.filter((p) => filtreStatut === "tous" || p.statut === filtreStatut);
  const ic = (k) => `<span class="ic">${svgIcone(k)}</span>`;
  el.innerHTML = `
    <div class="accueil-tete"><div><h1>Vos publications, <i>dans la charte</i>.</h1>
    <p>Choisissez un point de départ. Le studio applique les couleurs, les polices et les marges HydroGrow, vérifie le ton et exporte les images prêtes à publier.</p></div></div>
    <div class="creer">
      <button data-creer="article">${ic("idee")}<b>Depuis un article</b><span>Automatique : un article du blog devient un carrousel et sa légende.</span></button>
      <button data-creer="plan">${ic("courbe")}<b>Depuis un plan écrit</b><span>Semi-automatique : écrivez le fond, le studio met en page.</span></button>
      <button data-creer="carrousel">${ic("cube")}<b>Carrousel vierge</b><span>Couverture, une fiche et une fin, à remplir.</span></button>
      <button data-creer="unique">${ic("soleil")}<b>Post unique</b><span>Une seule image : annonce, photo, chiffre clé.</span></button>
      <button data-creer="story">${ic("wifi")}<b>Story</b><span>Format 1080 × 1920 avec les zones sûres d'Instagram.</span></button>
    </div>
    <div class="filtres"><h2>Projets (${liste.length})</h2>${["tous", ...Object.keys(STATUTS)]
      .map((s) => `<button class="puce" data-filtre="${s}" aria-pressed="${s === filtreStatut}">${s === "tous" ? "Tous" : STATUTS[s]}</button>`)
      .join("")}</div>
    ${visibles.length ? `<div class="projets">${visibles
      .map((p) => {
        const mini = p.apercu ? vignette({ format: p.format, pied: "aucun", diapos: [p.apercu] }, 0, 200).replace('class="vignette"', 'class="vignette" style="width:100%"') : "";
        return `<article class="projet" data-ouvrir="${p.slug}">${mini}<div class="projet-info"><b>${esc(p.titre)}</b><div class="projet-meta"><span class="statut statut-${p.statut}">${STATUTS[p.statut] ?? p.statut}</span><span>${p.diapos} diapo${p.diapos > 1 ? "s" : ""}</span>${p.date ? `<span>${new Date(p.date + "T12:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</span>` : ""}</div></div></article>`;
      })
      .join("")}</div>` : `<p class="vide">Aucun projet${filtreStatut !== "tous" ? " avec ce statut" : ""}.</p>`}`;
  // Les vignettes de l'accueil s'adaptent à la largeur de la carte
  for (const v of $$(".projet .vignette", el)) {
    const w = v.getBoundingClientRect().width;
    const e = v.firstElementChild;
    const f = FORMATS[liste.find((p) => p.slug === v.closest(".projet").dataset.ouvrir).format ?? "portrait"];
    e.style.transform = `scale(${w / f.l})`;
    v.style.height = `${(w / f.l) * f.h}px`;
  }
}

$("#accueil").addEventListener("click", async (e) => {
  const f = e.target.closest("[data-filtre]");
  if (f) return (filtreStatut = f.dataset.filtre), accueil();
  const o = e.target.closest("[data-ouvrir]");
  if (o) return ouvrir(o.dataset.ouvrir);
  const c = e.target.closest("[data-creer]");
  if (!c) return;
  const type = c.dataset.creer;
  if (type === "article") return choisirArticle();
  if (type === "plan") return editerPlan(null);
  if (type === "carrousel")
    return creer({ titre: "Nouveau carrousel", diapos: [diapo("couverture-photo"), diapo("fiche"), diapo("fin")] });
  if (type === "unique") return creer({ titre: "Nouveau post", pied: "site", diapos: [diapo("couverture", { sur: "", logoHaut: false })] });
  if (type === "story")
    return creer({ titre: "Nouvelle story", format: "story", pied: "logo", diapos: [diapo("couverture", { alignement: "centre", cercles: "centre", logoHaut: false })] });
});

async function creer(base) {
  const liste = await api("projets");
  const n = Math.max(0, ...liste.map((p) => parseInt(p.slug) || 0)) + 1;
  let slug = `${n}-${slugifier(base.titre)}`;
  while (liste.some((p) => p.slug === slug)) slug += "-2";
  const p = {
    slug,
    titre: base.titre,
    format: base.format ?? "portrait",
    pied: base.pied ?? "pagination",
    site: "hydrogrow.fr",
    statut: "brouillon",
    date: "",
    legende: base.legende ?? { texte: "", hashtags: ["hydroponie", "HydroGrow"] },
    diapos: base.diapos,
  };
  if (!p.legende.texte) p.legende.texte = legendeDepuisDiapos(p.diapos);
  for (const d of p.diapos) d.alt ||= altAuto(d);
  await api(`projets/${slug}`, { method: "PUT", headers: { "x-auteur": "humain", "x-source": CLIENT }, body: JSON.stringify(assurerIds(p)) });
  fermerModale();
  await ouvrir(slug);
}

async function choisirArticle() {
  const corps = ouvrirModale("Créer depuis un article du blog", `<p class="charge">Lecture des articles…</p>`);
  const articles = await api("blog");
  corps.innerHTML = `<p class="aide-plan">Le studio reprend la photo, le titre et les grandes parties de l'article (une fiche par partie, six au plus), puis rédige une légende avec des hashtags adaptés. Tout reste modifiable ensuite.</p>
  <div class="articles">${articles
    .map((a, i) => `<button class="article" data-article="${i}"><span class="mini-photo" style="background-image:url('${encodeURI(a.image)}')"></span><span><b>${esc(a.titre)}</b><span>${esc(a.tags.join(" · "))}</span></span></button>`)
    .join("")}</div>`;
  corps.onclick = (e) => {
    const b = e.target.closest("[data-article]");
    if (!b) return;
    corps.onclick = null;
    const g = depuisArticle(articles[b.dataset.article]);
    creer({ titre: g.titre, diapos: g.diapos, legende: g.legende });
  };
}

// ---------- Plan écrit ----------

function editerPlan(cible) {
  const corps = ouvrirModale(cible ? "Ajouter des diapos depuis un plan" : "Créer depuis un plan écrit", `
    <div class="plan">
      <div class="champ"><span>Votre plan <em>un bloc par diapo, séparés par ---</em></span><textarea id="plan-texte" spellcheck="true">${esc(EXEMPLE_PLAN)}</textarea></div>
      <div class="aide-plan">
        <p>Écrivez le fond, le studio choisit le modèle de chaque diapo selon ces repères :</p>
        <dl>
          <dt><code># Titre</code></dt><dd>Couverture (avec photo si une ligne <code>@ /images/…</code> est présente)</dd>
          <dt><code>## Titre</code></dt><dd>Fiche, avec <code>- Étiquette | texte</code> pour les cartes et <code>icone: ph</code></dd>
          <dt><code>&gt; Texte</code></dt><dd>Sur-titre en capitales</dd>
          <dt><code>= 82 | %</code></dt><dd>Chiffre clé ; la ligne suivante devient le titre</dd>
          <dt><code>1. Titre | détail</code></dt><dd>Étapes numérotées</dd>
          <dt><code>" Citation</code></dt><dd>Citation, puis <code>— Auteur</code></dd>
          <dt><code>! Titre</code></dt><dd>Diapo de fin</dd>
          <dt><code>[Texte]</code></dt><dd>Pastille verte</dd>
          <dt><code>*mot*</code></dt><dd>Accent vert pousse (à garder rare)</dd>
        </dl>
        <p>Icônes : ${Object.keys(ICONES).join(", ")}.</p>
      </div>
    </div>
    <div class="champ"><span>Aperçu <em id="plan-nb"></em></span><div class="apercu-plan" id="plan-apercu"></div></div>
    <div class="pied-modale">${cible ? "" : `<input id="plan-titre" placeholder="Titre du projet" style="max-width:320px">`}<button class="btn principal" id="plan-ok">${cible ? "Ajouter ces diapos" : "Créer le projet"}</button></div>`);
  const zone = $("#plan-texte", corps);
  const maj = () => {
    const diapos = depuisPlan(zone.value);
    const p = { format: cible?.format ?? "portrait", pied: cible?.pied ?? "pagination", diapos };
    $("#plan-apercu", corps).innerHTML = diapos.map((_, i) => vignette(p, i, 150)).join("");
    $("#plan-nb", corps).textContent = `${diapos.length} diapo${diapos.length > 1 ? "s" : ""} : ${diapos.map((d) => MODELES[d.modele].nom).join(", ")}`;
    return diapos;
  };
  zone.oninput = () => (clearTimeout(maj.t), (maj.t = setTimeout(maj, 250)));
  maj();
  $("#plan-ok", corps).onclick = () => {
    const diapos = maj();
    if (!diapos.length) return toast("Le plan est vide.");
    if (cible) {
      for (const d of diapos) d.alt ||= altAuto(d);
      modifier(() => projet.diapos.splice(courant + 1, 0, ...diapos), { inspecteur: true });
      courant += 1;
      fermerModale();
      rafraichir({ inspecteur: true });
    } else {
      const titre = $("#plan-titre", corps).value.trim() || String(diapos[0].champs.titre ?? "Nouveau post").replace(/[*\n]/g, " ").replace(/\s+/g, " ").trim();
      creer({ titre, diapos });
    }
  };
}

// ---------- Éditeur ----------

async function ouvrir(slug) {
  if (projet) await sauver();
  projet = assurerIds(await api(`projets/${slug}`));
  base = structuredClone(projet);
  courant = 0;
  historique = [];
  futur = [];
  history.replaceState(null, "", `/?projet=${slug}`);
  $("#accueil").hidden = true;
  $("#editeur").hidden = false;
  $(".barre-projet").hidden = false;
  $('[data-action="exporter"]').hidden = false;
  $("#etat").textContent = "Enregistré";
  rafraichir({ inspecteur: true, entete: true });
  if (!$("#onglet-legende").hidden) rendreLegende();
  if (!$("#onglet-activite").hidden) rendreActivite();
}

function remplirEntete() {
  $("#format").innerHTML = Object.entries(FORMATS).map(([k, f]) => `<option value="${k}">${f.nom}</option>`).join("");
  $("#titre").value = projet.titre ?? "";
  $("#format").value = projet.format ?? "portrait";
  $("#pied").value = projet.pied ?? "pagination";
  $("#statut").value = projet.statut ?? "brouillon";
  $("#date").value = projet.date ?? "";
  document.title = `${projet.titre} · Studio Instagram`;
}
for (const id of ["titre", "format", "pied", "statut", "date"]) {
  $(`#${id}`).addEventListener(id === "titre" ? "input" : "change", (e) => modifier(() => (projet[id] = e.target.value)));
}

// Mémorise le champ en cours de saisie pour le retrouver après une mise à jour venue d'ailleurs
function memoriserFocus() {
  const el = document.activeElement;
  if (!el || !el.closest?.(".inspecteur, .barre")) return null;
  const sel = el.dataset.champ ? `[data-champ="${el.dataset.champ}"]` : el.matches("[data-alt]") ? "[data-alt]" : el.id ? `#${el.id}` : null;
  return sel && { sel, debut: el.selectionStart, fin: el.selectionEnd, defil: $(".inspecteur").scrollTop };
}
function restaurerFocus(f) {
  if (!f) return;
  const el = $(f.sel);
  $(".inspecteur").scrollTop = f.defil;
  if (!el) return;
  el.focus({ preventScroll: true });
  try { if (f.debut != null) el.setSelectionRange(Math.min(f.debut, el.value.length), Math.min(f.fin, el.value.length)); } catch {}
}

function rafraichir({ inspecteur = false, entete = false, garderFocus = false } = {}) {
  if (!projet) return;
  const focus = garderFocus ? memoriserFocus() : null;
  if (entete) remplirEntete();
  // Liste des diapos
  const liste = $("#liste");
  liste.innerHTML = projet.diapos
    .map((d, i) => `<li draggable="true" data-i="${i}" data-id="${d.id}" class="${i === courant ? "actif" : ""}"><span class="num">${i + 1}</span>${vignette(projet, i, 176)}<div class="actions"><button data-act="haut" title="Monter">↑</button><button data-act="bas" title="Descendre">↓</button><button data-act="dupliquer" title="Dupliquer (Ctrl+D)">⧉</button><button data-act="supprimer" title="Supprimer">✕</button></div></li>`)
    .join("");
  $("#nb").textContent = `${projet.diapos.length} / 20`;
  // Débordements mesurés sur les vignettes (rendu à taille réelle)
  debordements = new Set();
  $$("#liste li").forEach((li, i) => {
    const c = $(".hg-corps", li);
    if (c && (c.scrollHeight > c.clientHeight + 2 || c.scrollWidth > c.clientWidth + 2)) {
      debordements.add(i);
      li.insertAdjacentHTML("beforeend", `<span class="alerte-vignette">Déborde</span>`);
    }
  });
  rendreApercu();
  if (inspecteur) rendreInspecteur();
  rendreVerifications();
  if (!$("#onglet-legende").hidden) (garderFocus ? rendreLegende() : majApercuLegende());
  rendrePresences();
  restaurerFocus(focus);
  signalerPlusTard();
}

function rendreApercu() {
  const zone = $("#apercu");
  const f = FORMATS[projet.format ?? "portrait"];
  const r = zone.getBoundingClientRect();
  const s = Math.min((r.width - 48) / f.l, (r.height - 32) / f.h, 1);
  const larg = Math.max(200, Math.floor(f.l * s));
  zone.innerHTML = projet.diapos.length ? vignette(projet, courant, larg) : `<p class="vide">Ajoutez une diapo pour commencer.</p>`;
  $("#position").textContent = projet.diapos.length ? `${courant + 1} / ${projet.diapos.length}` : "";
  if ($("#zones").checked && projet.diapos.length) {
    const v = $(".vignette", zone);
    const k = larg / f.l;
    const zones =
      projet.format === "story"
        ? `<div style="top:0;height:${200 * k}px">Barre de la story</div><div style="bottom:0;height:${230 * k}px">Réponse et partage</div>`
        : projet.format === "portrait"
          ? `<div style="top:0;height:${135 * k}px;background:none;border-style:dotted">Rogné dans la grille du profil (3:4)</div><div style="bottom:0;height:${135 * k}px;background:none;border-style:dotted">Rogné dans la grille</div>`
          : "";
    v.insertAdjacentHTML("beforeend", `<div class="zones">${zones}</div>`);
  }
}
$("#zones").onchange = () => projet && rendreApercu();
new ResizeObserver(() => projet && rendreApercu()).observe($("#apercu"));

// Actions sur la liste
$("#liste").addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const i = Number(li.dataset.i);
  const act = e.target.closest("[data-act]")?.dataset.act;
  if (!act) {
    courant = i;
    return rafraichir({ inspecteur: true });
  }
  e.stopPropagation();
  modifier(
    () => {
      const d = projet.diapos;
      if (act === "haut" && i > 0) [d[i - 1], d[i]] = [d[i], d[i - 1]], (courant = i - 1);
      if (act === "bas" && i < d.length - 1) [d[i + 1], d[i]] = [d[i], d[i + 1]], (courant = i + 1);
      if (act === "dupliquer") d.splice(i + 1, 0, { ...structuredClone(d[i]), id: nouvelId() }), (courant = i + 1);
      if (act === "supprimer") {
        if (d.length === 1) return toast("Un projet garde au moins une diapo.");
        d.splice(i, 1);
        if (courant >= i && courant > 0) courant--;
        toast("Diapo supprimée (Ctrl+Z pour annuler)");
      }
    },
    { inspecteur: true },
  );
});

// Glisser-déposer pour réordonner
let glisse = null;
$("#liste").addEventListener("dragstart", (e) => {
  glisse = Number(e.target.closest("li")?.dataset.i);
  e.target.closest("li")?.classList.add("glisse");
  e.dataTransfer.effectAllowed = "move";
});
$("#liste").addEventListener("dragover", (e) => {
  e.preventDefault();
  $$("#liste li").forEach((l) => l.classList.remove("cible"));
  e.target.closest("li")?.classList.add("cible");
});
$("#liste").addEventListener("drop", (e) => {
  e.preventDefault();
  const cible = Number(e.target.closest("li")?.dataset.i);
  if (glisse == null || Number.isNaN(cible) || cible === glisse) return rafraichir();
  modifier(
    () => {
      const [d] = projet.diapos.splice(glisse, 1);
      projet.diapos.splice(cible, 0, d);
      courant = cible;
    },
    { inspecteur: true },
  );
});
$("#liste").addEventListener("dragend", () => ((glisse = null), $$("#liste li").forEach((l) => l.classList.remove("glisse", "cible"))));

// ---------- Inspecteur : diapo ----------

function rendreInspecteur() {
  const el = $("#onglet-diapo");
  const d = projet.diapos[courant];
  if (!d) return (el.innerHTML = "");
  const m = MODELES[d.modele];
  const champs = m.champs
    .map((c) => {
      const v = d.champs[c.id] ?? c.defaut ?? "";
      const aide = c.aide ? `<small>${esc(c.aide)}</small>` : "";
      switch (c.type) {
        case "texte":
          return `<label class="champ"><span>${c.label}</span><input data-champ="${c.id}" value="${esc(v)}">${aide}</label>`;
        case "zone":
          return `<label class="champ"><span>${c.label}</span><textarea data-champ="${c.id}" rows="${Math.min(8, Math.max(2, String(v).split("\n").length + 1))}">${esc(v)}</textarea>${aide}</label>`;
        case "choix":
          return `<label class="champ"><span>${c.label}</span><select data-champ="${c.id}">${Object.entries(c.options)
            .map(([k, n]) => `<option value="${k}" ${k === v ? "selected" : ""}>${n}</option>`)
            .join("")}</select></label>`;
        case "case":
          return `<label class="champ champ-case"><input type="checkbox" data-champ="${c.id}" ${v ? "checked" : ""}>${c.label}</label>`;
        case "curseur":
          return `<label class="champ"><span>${c.label}<em>${v}</em></span><input type="range" min="${c.min ?? 0}" max="${c.max ?? 100}" data-champ="${c.id}" value="${v}"></label>`;
        case "image":
          return `<div class="champ"><span>${c.label}</span><div class="choix-image"><span class="mini-photo" style="background-image:url('${encodeURI(v)}')"></span><div><button class="btn" data-image="${c.id}">Choisir une image</button>${v ? `<code title="${esc(v)}">${esc(v)}</code>` : ""}</div></div></div>`;
        case "icone":
          return `<div class="champ"><span>${c.label}</span><div class="icones">${["", ...Object.keys(ICONES)]
            .map((k) => `<button data-icone="${k}" data-pour="${c.id}" title="${k || "Aucune"}" aria-pressed="${k === v}">${k ? svgIcone(k) : '<span class="aucune">aucune</span>'}</button>`)
            .join("")}</div></div>`;
      }
    })
    .join("");
  el.innerHTML = `
    <div class="modele-actuel"><div><b>${m.nom}</b><span>${m.description}</span></div><button class="btn" data-action="changer-modele">Changer</button></div>
    ${champs}
    <hr class="separateur">
    <label class="champ"><span>Texte alternatif <em><button class="btn lien" data-action="alt-auto">Proposer</button></em></span><textarea data-alt rows="2" placeholder="Décrivez l'image pour les personnes qui ne la voient pas.">${esc(d.alt ?? "")}</textarea></label>`;
}

$("#onglet-diapo").addEventListener("input", (e) => {
  const t = e.target;
  const d = projet.diapos[courant];
  if (t.matches("[data-alt]")) return modifier(() => (d.alt = t.value));
  const id = t.dataset.champ;
  if (!id) return;
  const v = t.type === "checkbox" ? t.checked : t.type === "range" ? Number(t.value) : t.value;
  if (t.type === "range") t.previousElementSibling.querySelector("em").textContent = v;
  modifier(() => (d.champs[id] = v));
});
$("#onglet-diapo").addEventListener("click", (e) => {
  const d = projet.diapos[courant];
  const ic = e.target.closest("[data-icone]");
  if (ic) {
    modifier(() => (d.champs[ic.dataset.pour] = ic.dataset.icone));
    $$("[data-icone]", e.currentTarget).forEach((b) => b.setAttribute("aria-pressed", b === ic));
    return;
  }
  const im = e.target.closest("[data-image]");
  if (im) return choisirImage(d.champs[im.dataset.image], (url) => modifier(() => (d.champs[im.dataset.image] = url), { inspecteur: true }));
  if (e.target.closest('[data-action="alt-auto"]')) {
    modifier(() => (d.alt = altAuto(d)), { inspecteur: true });
  }
});

// Galerie des modèles : ajout d'une diapo ou changement de modèle
function galerieModeles(titre, actuel, choisir) {
  const p = { format: projet.format, pied: "aucun", diapos: [] };
  const groupes = {};
  for (const [k, m] of Object.entries(MODELES)) (groupes[m.groupe] ??= []).push(k);
  const corps = ouvrirModale(
    titre,
    `<div class="grille-modeles">${Object.entries(groupes)
      .map(
        ([g, ks]) =>
          `<h3>${g}</h3>${ks
            .map((k) => {
              p.diapos = [{ modele: k, champs: valeursParDefaut(k) }];
              return `<button class="carte-modele" data-modele="${k}" aria-pressed="${k === actuel}">${vignette(p, 0, 152)}<b>${MODELES[k].nom}</b><span>${MODELES[k].description}</span></button>`;
            })
            .join("")}`,
      )
      .join("")}</div>`,
  );
  corps.onclick = (e) => {
    const b = e.target.closest("[data-modele]");
    if (!b) return;
    corps.onclick = null;
    fermerModale();
    choisir(b.dataset.modele);
  };
}

function ajouterDiapo() {
  galerieModeles("Ajouter une diapo", null, (k) => {
    modifier(
      () => {
        const d = diapo(k);
        d.alt = altAuto(d);
        projet.diapos.splice(courant + 1, 0, d);
        courant += 1;
      },
      { inspecteur: true },
    );
  });
}

function changerModele() {
  const d = projet.diapos[courant];
  galerieModeles("Changer de modèle", d.modele, (k) => {
    // On garde les valeurs des champs communs (titre, texte, fond…)
    modifier(
      () => {
        const ids = new Set(MODELES[k].champs.map((c) => c.id));
        const garde = Object.fromEntries(Object.entries(d.champs).filter(([id, v]) => ids.has(id) && v !== "" && v != null));
        if (garde.titre == null && d.champs.citation) garde.titre = d.champs.citation;
        projet.diapos[courant] = { ...d, modele: k, champs: { ...valeursParDefaut(k), ...garde } };
      },
      { inspecteur: true },
    );
  });
}

// ---------- Choix d'image ----------

async function choisirImage(actuelle, choisir) {
  const corps = ouvrirModale("Choisir une image", `<p class="charge">Chargement…</p>`);
  const charger = async () => {
    const { medias, site } = await api("images");
    const grille = (liste) => `<div class="grille-images">${liste.map((u) => `<button data-url="${esc(u)}" title="${esc(u)}" aria-pressed="${u === actuelle}" style="background-image:url('${encodeURI(u)}')"></button>`).join("")}</div>`;
    corps.innerHTML = `
      <label class="depot" id="depot">Glissez vos photos ici ou <u>parcourez</u> (jpg, png, webp). Elles sont rangées dans <code>instagram/medias</code>.<input type="file" accept="image/png,image/jpeg,image/webp,image/avif" multiple hidden></label>
      <h3>Vos médias</h3>${medias.length ? grille(medias) : `<p class="vide">Aucun média importé pour l'instant.</p>`}
      <h3>Images du site</h3>${grille(site)}
      <p class="aide-plan">Charte : plans serrés, lumière naturelle, peu de personnes, jamais de photo de banque d'images.</p>`;
    const depot = $("#depot", corps);
    const envoyer = async (fichiers) => {
      let derniere;
      for (const f of fichiers) {
        try {
          derniere = (await api("medias", { method: "POST", headers: { "x-nom": f.name }, body: f })).url;
        } catch (e) {
          toast(e.message);
        }
      }
      if (derniere) actuelle = derniere;
      await charger();
    };
    $("input", depot).onchange = (e) => envoyer([...e.target.files]);
    depot.ondragover = (e) => (e.preventDefault(), depot.classList.add("survol"));
    depot.ondragleave = () => depot.classList.remove("survol");
    depot.ondrop = (e) => (e.preventDefault(), envoyer([...e.dataTransfer.files]));
  };
  corps.onclick = (e) => {
    const b = e.target.closest("[data-url]");
    if (!b) return;
    corps.onclick = null;
    fermerModale();
    choisir(b.dataset.url);
  };
  await charger();
}

// ---------- Légende ----------

function rendreLegende() {
  const l = projet.legende;
  const tous = new Set(Object.values(HASHTAGS).flat());
  const perso = l.hashtags.filter((t) => !tous.has(t));
  $("#onglet-legende").innerHTML = `
    <div class="ligne-actions"><button class="btn" data-action="legende-auto">Rédiger depuis les diapos</button><button class="btn principal" data-action="copier">Copier la légende</button></div>
    <label class="champ"><span>Légende <em class="compteurs" id="compteurs"></em></span><textarea id="legende" rows="12">${esc(l.texte)}</textarea>
    <small>Les 125 premiers caractères s'affichent avant « plus » : l'accroche doit tenir dedans.</small></label>
    <div class="champ"><span>Appels à l'action</span><div class="puces">${APPELS.map((a, i) => `<button class="puce" data-appel="${i}">${esc(a)}</button>`).join("")}</div></div>
    <div class="champ"><span>Hashtags <em id="nbtags"></em></span>
      ${Object.entries(HASHTAGS)
        .map(([g, ts]) => `<div class="groupe-tags"><h4>${g}</h4><div class="puces">${ts.map((t) => `<button class="puce" data-tag="${t}" aria-pressed="${l.hashtags.includes(t)}">#${t}</button>`).join("")}</div></div>`)
        .join("")}
      ${perso.length ? `<div class="groupe-tags"><h4>Ajoutés</h4><div class="puces">${perso.map((t) => `<button class="puce" data-tag="${esc(t)}" aria-pressed="true">#${esc(t)} ✕</button>`).join("")}</div></div>` : ""}
      <input id="tag-perso" placeholder="Ajouter un hashtag puis Entrée">
    </div>
    <div class="champ"><span>Aperçu</span><div class="ig" id="ig"></div></div>`;
  majApercuLegende();
}

function majApercuLegende() {
  const l = projet.legende;
  const total = l.texte.length + l.hashtags.reduce((s, t) => s + t.length + 2, 0);
  const c = $("#compteurs");
  if (!c) return;
  c.innerHTML = `<span class="${total > 2200 ? "trop" : ""}">${total} / 2 200</span>`;
  $("#nbtags").innerHTML = `<span class="${l.hashtags.length > 5 ? "trop" : ""}">${l.hashtags.length} choisis · 3 à 5 conseillés</span>`;
  const accroche = l.texte.slice(0, 125);
  $("#ig").innerHTML = `<div class="ig-tete"><img src="${marque.icone}" alt="">hydrogrow.fr</div><div><b>hydrogrow.fr</b> ${esc(accroche).replace(/\n/g, "<br>")}${l.texte.length > 125 ? `<span class="plus">… plus</span>` : ""}</div>`;
}

$("#onglet-legende").addEventListener("input", (e) => {
  if (e.target.id === "legende") modifier(() => (projet.legende.texte = e.target.value));
});
$("#onglet-legende").addEventListener("keydown", (e) => {
  if (e.target.id !== "tag-perso" || e.key !== "Enter") return;
  const t = e.target.value.replace(/^#/, "").replace(/\s+/g, "").trim();
  if (t && !projet.legende.hashtags.includes(t)) modifier(() => projet.legende.hashtags.push(t));
  rendreLegende();
  $("#tag-perso").focus();
});
$("#onglet-legende").addEventListener("click", async (e) => {
  const tag = e.target.closest("[data-tag]")?.dataset.tag;
  if (tag) {
    modifier(() => {
      const h = projet.legende.hashtags;
      h.includes(tag) ? h.splice(h.indexOf(tag), 1) : h.push(tag);
    });
    return rendreLegende();
  }
  const appel = e.target.closest("[data-appel]")?.dataset.appel;
  if (appel != null) {
    const zone = $("#legende");
    const pos = zone.selectionStart ?? zone.value.length;
    const a = APPELS[appel];
    modifier(() => (projet.legende.texte = `${zone.value.slice(0, pos)}${pos && zone.value[pos - 1] !== "\n" ? "\n" : ""}${a}\n${zone.value.slice(pos)}`));
    return rendreLegende();
  }
});

async function copierLegende() {
  const l = projet.legende;
  const texte = `${l.texte.trim()}${l.hashtags.length ? `\n\n${l.hashtags.map((t) => `#${t}`).join(" ")}` : ""}`;
  await navigator.clipboard.writeText(texte);
  toast("Légende copiée");
}

// ---------- Vérifications ----------

function rendreVerifications() {
  const liste = verifier(projet, debordements);
  const graves = liste.filter((v) => v.niveau !== "conseil").length;
  const nb = $("#nbverif");
  nb.textContent = liste.length ? String(liste.length) : "✓";
  nb.className = `pastille-nb ${graves ? "" : "ok"}`;
  const noms = { erreur: "À corriger", attention: "À revoir", conseil: "Conseil" };
  $("#onglet-verifier").innerHTML = liste.length
    ? `<ul class="verifs">${liste
        .sort((a, b) => ["erreur", "attention", "conseil"].indexOf(a.niveau) - ["erreur", "attention", "conseil"].indexOf(b.niveau))
        .map((v) => `<li class="${v.niveau}" ${v.diapo ? `data-diapo="${v.diapo - 1}"` : ""}><b>${noms[v.niveau]}${v.diapo ? ` · diapo ${v.diapo}` : ""}</b>${esc(v.texte)}</li>`)
        .join("")}</ul>`
    : `<div class="tout-va-bien"><strong>Tout est dans la charte.</strong>Le post est prêt à être exporté.</div>`;
}
$("#onglet-verifier").addEventListener("click", (e) => {
  const li = e.target.closest("[data-diapo]");
  if (!li) return;
  courant = Number(li.dataset.diapo);
  rafraichir({ inspecteur: true });
});

// ---------- Export ----------

async function exporterPng() {
  const graves = verifier(projet, debordements).filter((v) => v.niveau === "erreur");
  const corps = ouvrirModale("Export des images", `<p class="charge">Rendu de ${projet.diapos.length} image${projet.diapos.length > 1 ? "s" : ""} avec Chrome…</p>`, { large: false });
  await sauver();
  try {
    const r = await api(`exporter/${projet.slug}`, { method: "POST" });
    const t = Date.now();
    corps.innerHTML = `
      ${graves.length ? `<ul class="verifs"><li class="erreur"><b>Attention</b>${graves.length} point${graves.length > 1 ? "s" : ""} à corriger avant de publier (onglet Vérifier).</li></ul>` : ""}
      <p>Les images et la légende sont enregistrées dans :</p><p class="chemin">${esc(r.dossier)}</p>
      <div class="exports">${r.fichiers.map((f) => `<a href="/exports/${f}?t=${t}" download="${f.replace("/", "-")}"><img src="/exports/${f}?t=${t}" alt=""></a>`).join("")}</div>
      <div class="pied-modale"><button class="btn" data-action="copier">Copier la légende</button>${projet.statut !== "publie" ? `<button class="btn principal" data-action="marquer-pret">Marquer comme prêt</button>` : ""}</div>`;
  } catch (e) {
    corps.innerHTML = `<ul class="verifs"><li class="erreur"><b>Échec</b>${esc(e.message)}</li></ul>`;
  }
}

// ---------- Actions globales ----------

document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-action]")?.dataset.action;
  const o = e.target.closest("[data-onglet]")?.dataset.onglet;
  if (o) {
    $$("[data-onglet]").forEach((b) => b.setAttribute("aria-selected", b.dataset.onglet === o));
    for (const n of ["diapo", "legende", "verifier", "activite"]) $(`#onglet-${n}`).hidden = n !== o;
    if (o === "legende") rendreLegende();
    if (o === "activite") rendreActivite();
    ongletActif = o;
    signalerPlusTard();
    return;
  }
  if (!a) return;
  const actions = {
    accueil,
    fermer: fermerModale,
    exporter: exporterPng,
    ajouter: ajouterDiapo,
    plan: () => editerPlan(projet),
    "changer-modele": changerModele,
    precedente: () => courant > 0 && (courant--, rafraichir({ inspecteur: true })),
    suivante: () => courant < projet.diapos.length - 1 && (courant++, rafraichir({ inspecteur: true })),
    annuler,
    retablir,
    copier: copierLegende,
    "legende-auto": () => {
      modifier(() => (projet.legende.texte = legendeDepuisDiapos(projet.diapos)));
      rendreLegende();
    },
    "marquer-pret": () => {
      modifier(() => (projet.statut = "pret"), { entete: true });
      remplirEntete();
      fermerModale();
      toast("Projet marqué comme prêt");
    },
  };
  actions[a]?.();
});

document.addEventListener("keydown", (e) => {
  if (!projet || $("#modale").open) return;
  const saisie = e.target.matches("input, textarea, select");
  const ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && e.key.toLowerCase() === "s") return e.preventDefault(), sauver();
  if (ctrl && e.key.toLowerCase() === "z" && !saisie) return e.preventDefault(), (e.shiftKey ? retablir : annuler)();
  if (ctrl && e.key.toLowerCase() === "y" && !saisie) return e.preventDefault(), retablir();
  if (ctrl && e.key.toLowerCase() === "d" && !saisie) {
    e.preventDefault();
    return modifier(() => (projet.diapos.splice(courant + 1, 0, { ...structuredClone(projet.diapos[courant]), id: nouvelId() }), courant++), { inspecteur: true });
  }
  if (saisie) return;
  if (e.key === "ArrowLeft" && courant > 0) courant--, rafraichir({ inspecteur: true });
  if (e.key === "ArrowRight" && courant < projet.diapos.length - 1) courant++, rafraichir({ inspecteur: true });
});
// En quittant la page, on envoie les derniers changements sans attendre la réponse
window.addEventListener("pagehide", () => {
  if (!projet || !base) return;
  const ops = difference(base, projet);
  if (ops.length) navigator.sendBeacon(`/api/projets/${projet.slug}/operations`, new Blob([JSON.stringify({ ops, auteur: "humain", source: CLIENT })], { type: "application/json" }));
});
ecouter();

// Démarrage : polices chargées avant de mesurer les débordements
await document.fonts.ready;
const depart = new URLSearchParams(location.search).get("projet");
depart ? ouvrir(depart).catch(accueil) : accueil();

$("#onglet-activite").addEventListener("click", (e) => {
  const li = e.target.closest("[data-aller]");
  if (!li || !projet) return;
  courant = Number(li.dataset.aller);
  rafraichir({ inspecteur: true });
});
