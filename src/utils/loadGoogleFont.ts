/**
 * Fonts for the Satori OG-image templates. Satori needs raw TTF/OTF data, so
 * we ask the Google Fonts CSS API (with an old User-Agent, which makes it
 * serve TrueType) for just the glyphs in `text`.
 */
export interface OgFont {
  /** Family name as referenced in the template's `fontFamily` */
  name: string;
  /** Google Fonts family, URL-encoded (e.g. "IBM+Plex+Mono") */
  family: string;
  weight: 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

export const OG_FONTS: OgFont[] = [
  { name: "Instrument Serif", family: "Instrument+Serif", weight: 400, style: "normal" },
  { name: "Instrument Serif", family: "Instrument+Serif", weight: 400, style: "italic" },
  { name: "IBM Plex Mono", family: "IBM+Plex+Mono", weight: 400, style: "normal" },
  { name: "IBM Plex Mono", family: "IBM+Plex+Mono", weight: 500, style: "normal" },
];

async function loadGoogleFont({ family, weight, style }: OgFont, text: string): Promise<ArrayBuffer> {
  const axis = style === "italic" ? `ital,wght@1,${weight}` : `wght@${weight}`;
  const API = `https://fonts.googleapis.com/css2?family=${family}:${axis}&text=${encodeURIComponent(text)}`;

  const css = await (
    await fetch(API, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    })
  ).text();

  const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);

  if (!resource) throw new Error(`Failed to download font ${family} ${weight} ${style}`);

  const res = await fetch(resource[1]);

  if (!res.ok) {
    throw new Error(`Failed to download font ${family}. Status: ${res.status}`);
  }

  return res.arrayBuffer();
}

async function loadGoogleFonts(
  text: string,
  fonts: OgFont[] = OG_FONTS
): Promise<Array<{ name: string; data: ArrayBuffer; weight: OgFont["weight"]; style: OgFont["style"] }>> {
  return Promise.all(
    fonts.map(async (font) => ({
      name: font.name,
      data: await loadGoogleFont(font, text),
      weight: font.weight,
      style: font.style,
    }))
  );
}

export default loadGoogleFonts;
