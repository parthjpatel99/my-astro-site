import { generateOgImageForSite } from "@/utils/generateOgImages";

export async function GET() {
  const png = await generateOgImageForSite();
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
}
