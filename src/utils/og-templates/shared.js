import { contours } from "@/utils/topo";

/** Site palette (day) — mirrors the tokens in src/styles/global.css */
export const OG = {
  width: 1200,
  height: 630,
  bg: "#f2ebdf",
  ink: "#1c1915",
  subtle: "#5f564c",
  accent: "#c2410c",
  live: "#3f7a4e",
  border: "#d9cebf",
  contour: "#d6c9b6",
  contourStrong: "#b7a58d",
};

/** Tiny hyperscript helper so the Satori trees stay readable */
export function h(type, style, ...children) {
  const kids = children.flat().filter((c) => c !== null && c !== undefined && c !== false);
  return { type, props: { style, children: kids.length === 1 ? kids[0] : kids } };
}

/** The contour map from the home hero, as a background image */
export function topoBackground(peaks) {
  const { minor, index } = contours(peaks);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}" viewBox="0 0 ${OG.width} ${OG.height}"><path d="${minor}" fill="none" stroke="${OG.contour}" stroke-width="1.2"/><path d="${index}" fill="none" stroke="${OG.contourStrong}" stroke-width="2"/></svg>`;
  return {
    type: "img",
    props: {
      src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
      width: OG.width,
      height: OG.height,
      style: { position: "absolute", top: 0, left: 0 },
    },
  };
}

/** Round "P" monogram + name, used in both card footers */
export function signature(name) {
  return h(
    "div",
    { display: "flex", alignItems: "center", gap: 16 },
    h(
      "div",
      {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 52,
        height: 52,
        borderRadius: 999,
        border: `2px solid ${OG.ink}`,
        fontFamily: "Instrument Serif",
        fontSize: 32,
        lineHeight: 1,
        paddingTop: 2,
      },
      "P"
    ),
    h("div", { display: "flex", fontFamily: "IBM Plex Mono", fontSize: 24, color: OG.ink }, name)
  );
}

export function domain() {
  return h(
    "div",
    { display: "flex", alignItems: "center", gap: 10, fontFamily: "IBM Plex Mono", fontSize: 24, fontWeight: 500, color: OG.ink },
    "parthjpatel.me",
    h("div", { display: "flex", width: 12, height: 12, borderRadius: 999, background: OG.accent })
  );
}
