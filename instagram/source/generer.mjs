// Génère les visuels Instagram (1080 × 1350) : node instagram/source/generer.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ici = dirname(fileURLToPath(import.meta.url));
const sortie = resolve(ici, "..");
const images = resolve(ici, "../../hgshow/public/images");
const img = (p) => pathToFileURL(join(images, p)).href;
const chrome = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const logo = `<img class="logo" src="${img("logo-horizontal.svg")}" alt="">`;

const icone = (d) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="#5BE3A8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const icones = {
  ph: '<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
  ec: '<path d="M13 3 5 13.5h6L10 21l9-11h-6z"/>',
  temp: '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 11v6"/>',
  niveau: '<path d="M5 4v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4"/><path d="M5 12c2.300-1.600 4.700-1.600 7 0s4.700 1.600 7 0"/>',
  climat: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.500 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/>',
};

// Cercles concentriques : le signal émis par le point (charte, planche 13)
const cercles = (x, y) =>
  `<svg class="cercles" viewBox="0 0 1080 1350">${[110, 200, 300, 410, 530]
    .map((r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#2D5083" stroke-width="2"/>`)
    .join("")}<circle cx="${x}" cy="${y}" r="26" fill="#5BE3A8"/></svg>`;

const pied = (page, total, suite = true) =>
  `<footer>${logo}<span>${page} / ${total}${suite ? " &nbsp;→" : ""}</span></footer>`;

const donnee = (n, cle, titre, texte, question, verifier) => `
  ${cercles(1010, 190)}
  <p class="sur">Donnée ${n} sur 5</p>
  <div class="tuile">${icone(icones[cle])}</div>
  <h2>${titre}</h2>
  <p class="texte">${texte}</p>
  <div class="carte"><b>La question</b><p>${question}</p></div>
  <div class="carte"><b>En cas d’écart, vérifiez</b><p>${verifier}</p></div>
  ${pied(n + 1, 7)}`;

const ligne = (nom, etat) => `<li><span>${nom}</span><em>${etat}</em></li>`;

const diapos = {
  "1-presentation/1": `
    <div class="photo" style="background-image:url('${img("video/video-thum.webp")}')"></div>
    <div class="voile"></div>
    <header>${logo}</header>
    <div class="bas">
      <h1>L’avenir<br>est <i>local.</i></h1>
      <p class="texte">Cultivez-le avec HydroGrow, la solution d’hydroponie connectée pensée pour les professionnels.</p>
      <p class="pastille">Planter. Connecter. Savourer.</p>
    </div>`,

  "2-les-5-donnees/1": `
    <div class="photo" style="background-image:url('${img("blog/hydroponie-donnees.webp")}')"></div>
    <div class="voile"></div>
    <div class="bas haut">
      <p class="sur">Guide hydroponie</p>
      <h1><i>5 données</i><br>à surveiller</h1>
      <p class="texte">Pour garder un œil sur les racines et sur le climat autour de la plante.</p>
    </div>
    ${pied(1, 7)}`,
  "2-les-5-donnees/2": donnee(1, "ph", "Le pH", "L’acidité de la solution nutritive. Il influence la disponibilité des nutriments.", "Les éléments restent-ils accessibles à la plante ?", "L’étalonnage de la sonde et l’eau ajoutée."),
  "2-les-5-donnees/3": donnee(2, "ec", "L’EC", "La conductivité électrique : une estimation de la quantité d’engrais dissous dans l’eau.", "La solution devient-elle plus ou moins concentrée ?", "Le niveau du bac et le dernier dosage."),
  "2-les-5-donnees/4": donnee(3, "temp", "La température<br>de l’eau", "Elle agit sur les racines et sur l’oxygène dissous.", "Les racines sont-elles exposées au chaud ou au froid ?", "Le soleil sur le réservoir, la pompe et le local."),
  "2-les-5-donnees/5": donnee(4, "niveau", "Le niveau<br>d’eau", "Suivre le réservoir aide à repérer un manque d’eau, une fuite ou une panne de pompe.", "La culture consomme-t-elle comme d’habitude ?", "Les fuites, l’appoint et la circulation."),
  "2-les-5-donnees/6": donnee(5, "climat", "Le climat", "Température de l’air, humidité et lumière donnent leur contexte aux autres valeurs.", "Qu’est-ce qui explique les autres variations ?", "L’aération, l’éclairage et la météo."),
  "2-les-5-donnees/7": `
    ${cercles(540, 330)}
    <div class="bas centre">
      <h2>La valeur vient<br>des <i>liens</i><br>entre les mesures.</h2>
      <p class="texte">Enregistrez ce post pour votre prochain relevé.</p>
      <p class="pastille">Le guide complet : hydrogrow.fr</p>
    </div>
    ${pied(7, 7, false)}`,

  "3-le-projet/1": `
    ${cercles(1010, 190)}
    <div class="serre">
    <p class="sur">Les coulisses</p>
    <h2>Où en est<br><i>HydroGrow</i> ?</h2>
    <p class="texte">Né en 2023 d’un logiciel de gestion d’hydroponie, devenu un projet mené en équipe.</p>
    <div class="carte"><b>Testé sur la première version</b><ul>
      ${ligne("pH et EC", "Saisie à la main")}
      ${ligne("Température de l’eau", "Capteur")}
      ${ligne("Niveau d’eau", "Capteur")}
      ${ligne("Climat de l’air", "Capteur")}
      ${ligne("Courbes et alertes", "Affichées")}
    </ul></div>
    <div class="carte"><b>Au programme</b><ul>
      ${ligne("Sondes pH et EC", "Dans les packs")}
      ${ligne("Autres capteurs", "Intégrés aux packs")}
    </ul></div>
    </div>
    <footer>${logo}<span>hydrogrow.fr</span></footer>`,
};

const page = (corps) => `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cal+Sans&family=Inter:wght@400;500;600&display=block" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#08172B;color:#EAF3EE;font:400 36px/1.5 Inter,sans-serif;padding:96px}
body>*{position:relative}
h1,h2{font-family:'Cal Sans',sans-serif;font-weight:400}
h1{font-size:140px;line-height:1.04}
h2{font-size:92px;line-height:1.08}
i{font-style:normal;color:#5BE3A8}
.logo{height:64px;display:block}
.cercles,.photo,.voile{position:absolute;inset:0;width:1080px;height:1350px}
.photo{background-size:cover;background-position:center}
.voile{background:linear-gradient(180deg,rgba(8,23,43,.80) 0%,rgba(8,23,43,.10) 30%,rgba(8,23,43,.55) 52%,#08172B 80%)}
.bas{position:absolute;left:96px;right:96px;bottom:96px}
.bas.haut{bottom:230px}
.bas.centre{bottom:250px;text-align:center}
.sur{font-weight:600;font-size:30px;letter-spacing:.12em;text-transform:uppercase;color:#5BE3A8;margin-bottom:28px}
.texte{margin-top:32px;max-width:800px}
.centre .texte{margin-left:auto;margin-right:auto}
.pastille{display:inline-block;margin-top:48px;padding:20px 40px;border-radius:99px;background:#5BE3A8;color:#08172B;font-weight:600;font-size:32px}
.tuile{width:136px;height:136px;border-radius:40px;background:#12305A;display:grid;place-items:center;margin:24px 0 40px}
.tuile svg{width:80px;height:80px}
.carte{background:#12305A;border-radius:40px;padding:32px 48px;margin-top:32px}
.carte b{display:block;font-weight:600;font-size:28px;color:#5BE3A8;margin-bottom:8px}
.carte p{font-size:34px;line-height:1.45}
ul{list-style:none}
li{display:flex;justify-content:space-between;font-size:32px;line-height:1.9}
li em{font-style:normal;opacity:.75}
footer{position:absolute;left:96px;right:96px;bottom:72px;display:flex;align-items:center;justify-content:space-between;font-weight:600;font-size:30px}
footer .logo{height:52px}
.serre h2{font-size:84px}
.serre .sur{margin-bottom:16px}
.serre .texte{margin-top:20px;font-size:32px}
.serre .carte{margin-top:24px;padding:24px 48px}
.serre li{font-size:30px;line-height:1.7}
</style></head><body>${corps.replace(/ ([?!:])/g, " $1")}</body></html>`;

const tmp = mkdtempSync(join(tmpdir(), "hg-insta-"));
for (const [nom, corps] of Object.entries(diapos)) {
  const html = join(tmp, `${nom.replace("/", "_")}.html`);
  const png = join(sortie, `${nom}.png`);
  writeFileSync(html, page(corps));
  mkdirSync(dirname(png), { recursive: true });
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--allow-file-access-from-files", "--window-size=1080,1350", "--virtual-time-budget=10000", `--user-data-dir=${join(tmp, "profil")}`, `--screenshot=${png}`, pathToFileURL(html).href], { stdio: "ignore", timeout: 60000 });
  console.log(png);
}
try { rmSync(tmp, { recursive: true, force: true }); } catch {}
