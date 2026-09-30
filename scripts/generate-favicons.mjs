/**
 * Generates the tab icons from one source: the Instrument Serif "P" plus the
 * orange full stop from the hero ("Parth Patel.").
 *
 *   node scripts/generate-favicons.mjs
 *
 * Writes public/favicon.svg (adaptive: night tile on light browsers, sand tile
 * on dark ones), public/favicon.ico (16/32/48) and public/apple-touch-icon.png.
 *
 * After changing the icons, bump the ?v= query on the <link> tags in
 * src/layouts/Layout.astro — browsers cache favicons by URL.
 */
import fs from "node:fs";
import { Resvg } from "@resvg/resvg-js";

// Instrument Serif "P" outline (font units, baseline at y=0; x 19..442, y -720..0)
const P = "M237 0L34 0Q19 0 19-11Q19-20 32-23L55-27Q76-31 82.5-38Q89-45 89-66L89-654Q89-675 82.5-682Q76-689 55-693L32-697Q19-700 19-709Q19-720 34-720L243-720Q302-720 347-694.5Q392-669 417-624Q442-579 442-520Q442-463 417-419Q392-375 348-350.5Q304-326 246-326L174-326Q160-326 160-312L160-70Q160-49 168-41.5Q176-34 204-29L241-23Q252-21 252-12Q252 0 237 0M160-655L160-406Q160-351 227-351Q292-351 329.5-397Q367-443 367-523Q367-605 329-650Q291-695 221-695Q160-695 160-655";

const NIGHT = { tile: "#14110e", ink: "#f1e9dc", dot: "#ff7a1a" };
const SAND = { tile: "#f2ebdf", ink: "#1c1915", dot: "#c2410c" };

/** Letter + full stop centred in a 64×64 box. Stroke thickens the hairlines so it survives 16px. */
function mark({ ink, dot }, cls = {}) {
  const cap = 40, s = cap / 720, w = 423 * s, gap = 2.2, r = 4.4;
  const x0 = 32 - (w + gap + 2 * r) / 2, base = 32 + cap / 2;
  const fill = (c, k) => (cls[k] ? `class="${cls[k]}"` : `fill="${c}"`);
  const letter = `<path d="${P}" ${fill(ink, "ink")} ${cls.ink ? "" : `stroke="${ink}"`} stroke-width="${(1.2 / s).toFixed(1)}" stroke-linejoin="round" transform="translate(${(x0 - 19 * s).toFixed(2)} ${base}) scale(${s.toFixed(5)})"/>`;
  const stop = `<circle cx="${(x0 + w + gap + r).toFixed(2)}" cy="${base - r}" r="${r}" ${fill(dot, "dot")}/>`;
  return letter + stop;
}

const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${inner}</svg>`;

// 1. Adaptive SVG favicon (Chrome, Firefox, Edge honour prefers-color-scheme inside it)
const adaptive = svg(
  `<style>.t{fill:${NIGHT.tile}}.i{fill:${NIGHT.ink};stroke:${NIGHT.ink}}.d{fill:${NIGHT.dot}}` +
    `@media (prefers-color-scheme:dark){.t{fill:${SAND.tile}}.i{fill:${SAND.ink};stroke:${SAND.ink}}.d{fill:${SAND.dot}}}</style>` +
    `<rect class="t" width="64" height="64" rx="14"/>` +
    mark(NIGHT, { ink: "i", dot: "d" })
);
fs.writeFileSync("public/favicon.svg", adaptive + "\n");

// Static night tile for raster fallbacks (Safari, crawlers, bookmarks)
const night = (rx) => svg(`<rect width="64" height="64" rx="${rx}" fill="${NIGHT.tile}"/>` + mark(NIGHT));
const png = (markup, size) => new Resvg(markup, { fitTo: { mode: "width", value: size } }).render().asPng();

// 2. favicon.ico with PNG-encoded 16/32/48 images
const sizes = [16, 32, 48];
const images = sizes.map((s) => png(night(14), s));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
fs.writeFileSync("public/favicon.ico", Buffer.concat([header, ...images]));

// 3. Apple touch icon: full-bleed (iOS applies its own rounded mask)
fs.writeFileSync("public/apple-touch-icon.png", png(night(0), 180));

console.log("Wrote public/favicon.svg, public/favicon.ico, public/apple-touch-icon.png");
