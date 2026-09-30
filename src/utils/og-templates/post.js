import satori from "satori";
import { smartQuotes } from "@/utils/smartQuotes";
import loadGoogleFonts from "../loadGoogleFont";
import { domain, h, OG, signature, topoBackground } from "./shared";

/**
 * Open Graph card for a field note (1200×630).
 * Sand ground + contour map, field-note number and date in mono, title in
 * the display serif, signature and domain along the bottom.
 *
 * @param post  the blog collection entry
 * @param meta  { number?: string, date: string, minutes: string } — see utils/notes.ts
 */
export default async (post, meta) => {
  const title = smartQuotes(post.data.title);
  const eyebrow = [meta.number ? `FIELD NOTE · NO. ${meta.number}` : "FIELD NOTE", meta.date, meta.minutes].join(" · ");
  // Shrink long titles so they stay within three lines
  const size = title.length > 70 ? 64 : title.length > 42 ? 80 : 96;
  const author = post.data.author?.split(" ").filter((_, i, a) => i === 0 || i === a.length - 1).join(" ") || "Parth Patel";

  return satori(
    h(
      "div",
      { display: "flex", position: "relative", width: "100%", height: "100%", background: OG.bg, color: OG.ink },
      topoBackground([
        { cx: 1020, cy: 250, count: 20, r0: 16, dr: 26, seed: 0.6, sx: 1.35, sy: 0.95 },
        { cx: 60, cy: 700, count: 10, r0: 30, dr: 30, seed: 3.1, sx: 1.2, sy: 0.9 },
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
          padding: "64px 72px 56px",
        },
        h(
          "div",
          { display: "flex", alignItems: "center", gap: 14, fontFamily: "IBM Plex Mono", fontSize: 22, letterSpacing: 2, color: OG.accent },
          h("div", { display: "flex", width: 12, height: 12, borderRadius: 999, background: OG.accent }),
          eyebrow
        ),
        h(
          "div",
          {
            display: "flex",
            maxWidth: 1000,
            fontFamily: "Instrument Serif",
            fontSize: size,
            lineHeight: 1.02,
            letterSpacing: -1.5,
          },
          title
        ),
        h(
          "div",
          { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `2px solid ${OG.ink}`, paddingTop: 28 },
          signature(author),
          domain()
        )
      )
    ),
    {
      width: OG.width,
      height: OG.height,
      embedFont: true,
      fonts: await loadGoogleFonts(title + eyebrow + author + "Pparthjpatel.me"),
    }
  );
};
