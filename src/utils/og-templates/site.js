import satori from "satori";
import { LOCATION } from "@/data/profile";
import loadGoogleFonts from "../loadGoogleFont";
import { domain, h, OG, signature, topoBackground } from "./shared";

/** Open Graph card for the site itself (home page and any page without its own). */
const TAGLINE =
  "I build the real-time systems behind an autonomous mining fleet — and write about building software in the age of agents.";

export default async () => {
  const eyebrow = `LIVE FROM ${LOCATION.city.toUpperCase()}`;

  return satori(
    h(
      "div",
      { display: "flex", position: "relative", width: "100%", height: "100%", background: OG.bg, color: OG.ink },
      topoBackground([
        { cx: 940, cy: 230, count: 22, r0: 16, dr: 24, seed: 0.6, sx: 1.4, sy: 0.95 },
        { cx: 1200, cy: 640, count: 12, r0: 30, dr: 28, seed: 2.1, sx: 1.2, sy: 0.9 },
      ]),
      h(
        "div",
        {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          width: "100%",
          height: "100%",
          padding: "60px 72px 56px",
        },
        h(
          "div",
          { display: "flex", alignItems: "center", gap: 14, fontFamily: "IBM Plex Mono", fontSize: 22, letterSpacing: 2, color: OG.subtle },
          h("div", { display: "flex", width: 12, height: 12, borderRadius: 999, background: OG.live }),
          eyebrow
        ),
        h(
          "div",
          { display: "flex", flexDirection: "column", gap: 24 },
          h(
            "div",
            { display: "flex", fontFamily: "Instrument Serif", fontSize: 150, lineHeight: 0.9, letterSpacing: -4 },
            "Parth Patel",
            h("span", { color: OG.accent }, ".")
          ),
          h(
            "div",
            { display: "flex", maxWidth: 880, fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 38, lineHeight: 1.2 },
            TAGLINE
          )
        ),
        h(
          "div",
          { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `2px solid ${OG.ink}`, paddingTop: 28 },
          signature("Software Engineer · Tucson, AZ"),
          domain()
        )
      )
    ),
    {
      width: OG.width,
      height: OG.height,
      embedFont: true,
      fonts: await loadGoogleFonts(eyebrow + "Parth Patel." + TAGLINE + "PSoftware Engineer · Tucson, AZparthjpatel.me"),
    }
  );
};
