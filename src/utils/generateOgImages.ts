import type { CollectionEntry } from "astro:content";
import { Resvg } from "@resvg/resvg-js";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export interface PostOgMeta {
  /** Field-note number ("02"); omitted for unlisted posts */
  number?: string;
  date: string;
  minutes: string;
}

export async function generateOgImageForPost(post: CollectionEntry<"blog">, meta: PostOgMeta) {
  const svg = await postOgImage(post, meta);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await siteOgImage();
  return svgBufferToPngBuffer(svg);
}
