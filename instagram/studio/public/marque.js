// Charge le logotype et l'icône du site, et prépare leurs variantes de fond.
import { variantesLogo } from "./modeles.js";

let cache;
export function chargerMarque() {
  cache ??= Promise.all([
    fetch("/images/logo-horizontal.svg").then((r) => r.text()),
    fetch("/images/logo-icon.svg").then((r) => r.text()),
  ]).then(([logo, icone]) => ({
    logos: variantesLogo(logo),
    icone: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(icone)}`,
  }));
  return cache;
}
