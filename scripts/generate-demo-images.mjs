/**
 * Génère les illustrations SVG de démonstration (produits + catégories).
 * Usage : npm run images
 * Remplacez ensuite ces fichiers par vos vraies photos produits.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "public", "images");
mkdirSync(join(root, "products"), { recursive: true });
mkdirSync(join(root, "categories"), { recursive: true });

const BLUE = "#087CFF";
const INK = "#080F20";

/* ---------- Dessins (zone 400×400, centrés sur 200,200) ---------- */
const draw = {
  watch: (c, round) => `
    <rect x="160" y="60" width="80" height="90" rx="18" fill="${INK}" opacity=".9"/>
    <rect x="160" y="250" width="80" height="90" rx="18" fill="${INK}" opacity=".9"/>
    ${round
      ? `<circle cx="200" cy="200" r="78" fill="#1b2440"/><circle cx="200" cy="200" r="64" fill="${INK}"/>
         <circle cx="200" cy="200" r="52" fill="none" stroke="${c}" stroke-width="6" stroke-dasharray="230 400" stroke-linecap="round" transform="rotate(-90 200 200)"/>`
      : `<rect x="130" y="118" width="140" height="164" rx="36" fill="#1b2440"/><rect x="142" y="130" width="116" height="140" rx="26" fill="${INK}"/>
         <circle cx="200" cy="200" r="42" fill="none" stroke="${c}" stroke-width="7" stroke-dasharray="180 400" stroke-linecap="round" transform="rotate(-90 200 200)"/>`}
    <text x="200" y="208" font-family="Arial" font-weight="700" font-size="24" fill="#fff" text-anchor="middle">10:09</text>
    <rect x="${round ? 276 : 270}" y="186" width="10" height="28" rx="4" fill="${c}"/>`,
  buds: (c) => `
    <rect x="110" y="200" width="180" height="120" rx="56" fill="#fff" stroke="#d9e2f1" stroke-width="3"/>
    <line x1="114" y1="244" x2="286" y2="244" stroke="#d9e2f1" stroke-width="3"/>
    <circle cx="200" cy="290" r="5" fill="${c}"/>
    <g transform="translate(140 90) rotate(-12)"><ellipse cx="0" cy="40" rx="30" ry="34" fill="#fff" stroke="#d9e2f1" stroke-width="3"/><rect x="-10" y="60" width="20" height="70" rx="10" fill="#fff" stroke="#d9e2f1" stroke-width="3"/><circle cx="0" cy="38" r="12" fill="${c}" opacity=".85"/></g>
    <g transform="translate(262 90) rotate(12)"><ellipse cx="0" cy="40" rx="30" ry="34" fill="#fff" stroke="#d9e2f1" stroke-width="3"/><rect x="-10" y="60" width="20" height="70" rx="10" fill="#fff" stroke="#d9e2f1" stroke-width="3"/><circle cx="0" cy="38" r="12" fill="${c}" opacity=".85"/></g>`,
  wired: (c) => `
    <path d="M130 120 C 130 220, 200 220, 200 260 C 200 220, 270 220, 270 120" fill="none" stroke="${INK}" stroke-width="6"/>
    <path d="M200 260 L 200 330" stroke="${INK}" stroke-width="6"/>
    <rect x="188" y="320" width="24" height="44" rx="6" fill="${c}"/>
    <circle cx="130" cy="100" r="30" fill="${INK}"/><circle cx="130" cy="100" r="16" fill="${c}"/>
    <circle cx="270" cy="100" r="30" fill="${INK}"/><circle cx="270" cy="100" r="16" fill="${c}"/>
    <rect x="236" y="196" width="18" height="36" rx="8" fill="${INK}"/>`,
  charger: (c, gan) => `
    <rect x="${gan ? 130 : 140}" y="${gan ? 120 : 140}" width="${gan ? 140 : 120}" height="${gan ? 170 : 140}" rx="26" fill="#fff" stroke="#d9e2f1" stroke-width="3"/>
    <rect x="165" y="${gan ? 92 : 112}" width="14" height="32" rx="5" fill="#b7c3d9"/><rect x="221" y="${gan ? 92 : 112}" width="14" height="32" rx="5" fill="#b7c3d9"/>
    ${gan
      ? `<rect x="172" y="240" width="56" height="12" rx="6" fill="${INK}"/><rect x="172" y="216" width="56" height="12" rx="6" fill="${INK}"/><rect x="164" y="262" width="72" height="14" rx="3" fill="${INK}" opacity=".7"/>`
      : `<rect x="172" y="232" width="56" height="16" rx="8" fill="${INK}"/>`}
    <path d="M206 160 l-20 32 h16 l-8 26 l26 -36 h-16 z" fill="${c}"/>`,
  car: (c) => `
    <rect x="170" y="110" width="60" height="70" rx="14" fill="${INK}"/>
    <path d="M176 180 h48 l-6 150 h-36 z" fill="#1b2440"/>
    <rect x="182" y="128" width="36" height="12" rx="6" fill="${c}"/><rect x="182" y="150" width="36" height="12" rx="3" fill="#7c8db0"/>
    <circle cx="200" cy="300" r="6" fill="${c}"/>`,
  cable: (c, end) => `
    <path d="M110 300 C 60 160, 340 260, 290 100" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round"/>
    <path d="M110 300 C 60 160, 340 260, 290 100" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 10" opacity=".45"/>
    <g transform="translate(110 300) rotate(-20)"><rect x="-20" y="0" width="40" height="64" rx="10" fill="${INK}"/><rect x="-12" y="60" width="24" height="26" rx="6" fill="#b7c3d9"/></g>
    <g transform="translate(290 100) rotate(160)"><rect x="-20" y="0" width="40" height="64" rx="10" fill="${INK}"/><rect x="-${end === "lightning" ? 8 : 12}" y="60" width="${end === "lightning" ? 16 : 24}" height="${end === "lightning" ? 32 : 26}" rx="${end === "lightning" ? 4 : 6}" fill="#b7c3d9"/></g>`,
  hub: (c) => `
    <rect x="100" y="150" width="200" height="100" rx="24" fill="#7c8db0"/>
    <rect x="106" y="156" width="188" height="88" rx="20" fill="#9aa8c4"/>
    <rect x="128" y="186" width="34" height="18" rx="3" fill="${INK}"/><rect x="172" y="186" width="30" height="12" rx="2" fill="${INK}"/><rect x="172" y="206" width="30" height="12" rx="2" fill="${INK}"/>
    <rect x="214" y="186" width="24" height="8" rx="2" fill="${INK}"/><rect x="250" y="186" width="22" height="32" rx="2" fill="${INK}"/>
    <path d="M200 150 C 200 110, 250 100, 260 70" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="276" cy="230" r="5" fill="${c}"/>`,
  otg: (c) => `
    <rect x="150" y="150" width="100" height="110" rx="18" fill="#9aa8c4"/>
    <rect x="166" y="174" width="68" height="26" rx="4" fill="${INK}"/><rect x="172" y="180" width="56" height="8" fill="#b7c3d9"/>
    <rect x="182" y="260" width="36" height="34" rx="8" fill="#b7c3d9"/>
    <circle cx="200" cy="232" r="6" fill="${c}"/>`,
  speaker: (c, big) => `
    ${big
      ? `<rect x="80" y="120" width="240" height="170" rx="70" fill="${INK}"/><circle cx="145" cy="205" r="48" fill="#1b2440" stroke="${c}" stroke-width="5"/><circle cx="255" cy="205" r="48" fill="#1b2440" stroke="${c}" stroke-width="5"/><circle cx="145" cy="205" r="18" fill="${c}" opacity=".6"/><circle cx="255" cy="205" r="18" fill="${c}" opacity=".6"/><rect x="150" y="96" width="100" height="22" rx="11" fill="#1b2440"/>`
      : `<rect x="130" y="100" width="140" height="210" rx="64" fill="${c}"/><rect x="142" y="112" width="116" height="186" rx="54" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
         ${Array.from({ length: 6 }, (_, r) => Array.from({ length: 5 }, (_, k) => `<circle cx="${160 + k * 20}" cy="${150 + r * 22}" r="4" fill="#fff" opacity=".35"/>`).join("")).join("")}
         <rect x="170" y="290" width="60" height="10" rx="5" fill="${INK}" opacity=".5"/>`}`,
  headphones: (c) => `
    <path d="M110 230 C 110 110, 290 110, 290 230" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>
    <rect x="86" y="214" width="64" height="104" rx="28" fill="${INK}"/><rect x="250" y="214" width="64" height="104" rx="28" fill="${INK}"/>
    <rect x="100" y="228" width="36" height="76" rx="16" fill="${c}"/><rect x="264" y="228" width="36" height="76" rx="16" fill="${c}"/>`,
  holder: (c) => `
    <rect x="150" y="80" width="110" height="200" rx="20" fill="${INK}"/><rect x="158" y="90" width="94" height="178" rx="14" fill="#1b2440"/>
    <rect x="166" y="104" width="78" height="44" rx="8" fill="${c}" opacity=".85"/><rect x="166" y="158" width="78" height="10" rx="5" fill="#33416b"/><rect x="166" y="176" width="56" height="10" rx="5" fill="#33416b"/>
    <circle cx="205" cy="290" r="34" fill="#7c8db0"/><circle cx="205" cy="290" r="20" fill="${INK}"/>
    <rect x="190" y="320" width="30" height="40" rx="6" fill="#7c8db0"/>`,
  powerbank: (c) => `
    <rect x="140" y="90" width="120" height="220" rx="24" fill="${INK}"/>
    <rect x="160" y="120" width="80" height="40" rx="8" fill="#0a1a3a"/>
    <text x="200" y="149" font-family="Arial" font-weight="700" font-size="22" fill="${c}" text-anchor="middle">88%</text>
    <rect x="175" y="280" width="20" height="8" rx="3" fill="#7c8db0"/><rect x="205" y="280" width="20" height="8" rx="3" fill="#7c8db0"/>
    <path d="M206 186 l-20 32 h16 l-8 26 l26 -36 h-16 z" fill="${c}"/>`,
  tripod: (c) => `
    <rect x="170" y="70" width="60" height="110" rx="10" fill="${INK}"/><rect x="176" y="78" width="48" height="92" rx="6" fill="${c}" opacity=".7"/>
    <rect x="195" y="180" width="10" height="110" fill="#7c8db0"/>
    <path d="M200 290 L140 350 M200 290 L260 350 M200 290 L200 352" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="250" cy="230" r="14" fill="${INK}"/><circle cx="250" cy="230" r="5" fill="${c}"/>`,
};

/* ---------- Gabarit commun ---------- */
function frame(inner, { bg = "light", label = "DÉMO", accent = BLUE } = {}) {
  const dark = bg === "dark";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="800" height="800">
  <defs>
    <radialGradient id="g" cx="50%" cy="40%" r="70%">
      <stop offset="0" stop-color="${dark ? "#16223F" : "#ffffff"}"/>
      <stop offset="1" stop-color="${dark ? INK : "#E8F1FF"}"/>
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <circle cx="200" cy="205" r="150" fill="${accent}" opacity="${dark ? 0.12 : 0.07}"/>
  <ellipse cx="200" cy="362" rx="110" ry="10" fill="${INK}" opacity=".08"/>
  ${inner}
  ${label ? `<g><rect x="${384 - (label.length * 9 + 22)}" y="360" rx="8" width="${label.length * 9 + 22}" height="24" fill="${dark ? "#ffffff" : INK}" opacity=".08"/><text x="${384 - (label.length * 9 + 22) + 11}" y="377" font-family="Arial" font-size="12" font-weight="700" letter-spacing="1.5" fill="${dark ? "#fff" : INK}" opacity=".55">${label}</text></g>` : ""}
</svg>`;
}

/* ---------- Produits : [slug, dessin, couleur principale, couleur variante] ---------- */
const products = [
  ["nexfit-pro-x1", (c) => draw.watch(c, false), BLUE, "#7c8db0"],
  ["pulse-active-s", (c) => draw.watch(c, false), "#22c55e", "#ec4899"],
  ["chrono-amoled-gt", (c) => draw.watch(c, true), BLUE, "#f59e0b"],
  ["airnex-buds-pro", draw.buds, BLUE, "#0f172a"],
  ["sonik-sport-neckband", draw.wired, "#f97316", BLUE],
  ["bassline-jack", draw.wired, BLUE, "#94a3b8"],
  ["bassline-usbc", draw.wired, "#8b5cf6", BLUE],
  ["voltcharge-20w", (c) => draw.charger(c, false), BLUE, "#22c55e"],
  ["voltcharge-65w-gan", (c) => draw.charger(c, true), BLUE, "#8b5cf6"],
  ["voltcharge-voiture-38w", draw.car, BLUE, "#f97316"],
  ["flexcable-usbc-60w", (c) => draw.cable(c, "usbc"), BLUE, "#0f172a"],
  ["flexcable-lightning", (c) => draw.cable(c, "lightning"), "#e2e8f0", BLUE],
  ["hub-usbc-6en1", draw.hub, BLUE, "#22c55e"],
  ["adaptateur-otg-usbc", draw.otg, BLUE, "#f97316"],
  ["boomnex-mini", (c) => draw.speaker(c, false), BLUE, "#ef4444"],
  ["boomnex-max-40w", (c) => draw.speaker(c, true), BLUE, "#a855f7"],
  ["airnex-studio", draw.headphones, BLUE, "#e2e8f0"],
  ["support-voiture-magnetique", draw.holder, BLUE, "#22c55e"],
  ["powernex-10000", draw.powerbank, BLUE, "#22c55e"],
  ["trepied-selfie-bluetooth", draw.tripod, BLUE, "#f97316"],
];

for (const [slug, fn, c1, c2] of products) {
  writeFileSync(join(root, "products", `${slug}.svg`), frame(fn(c1)));
  writeFileSync(join(root, "products", `${slug}-2.svg`), frame(fn(c2), { bg: "dark", accent: c2 }));
}

/* ---------- Catégories (fond sombre) ---------- */
const cats = [
  ["montres-connectees", draw.watch(BLUE, false)],
  ["ecouteurs", draw.buds(BLUE)],
  ["chargeurs", draw.charger(BLUE, true)],
  ["cables-adaptateurs", draw.cable(BLUE, "usbc")],
  ["enceintes-audio", draw.speaker(BLUE, false)],
  ["supports-accessoires", draw.holder(BLUE)],
];
for (const [slug, inner] of cats) {
  writeFileSync(join(root, "categories", `${slug}.svg`), frame(inner, { bg: "dark", label: "" }));
}

/* ---------- Bannière d'accueil ---------- */
writeFileSync(
  join(root, "hero.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="800" height="800">
  <circle cx="200" cy="200" r="170" fill="${BLUE}" opacity=".10"/>
  <circle cx="200" cy="200" r="120" fill="${BLUE}" opacity=".12"/>
  <g transform="translate(-40 -10) scale(.9)">${draw.watch(BLUE, true)}</g>
  <g transform="translate(150 160) scale(.55)">${draw.buds(BLUE)}</g>
</svg>`,
);

console.log(`✓ ${products.length * 2} images produits, ${cats.length} catégories et la bannière générées dans public/images`);
