import { getCollection } from "astro:content";
import { generateOgImageForPost } from "@/utils/generateOgImages";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}

export async function GET({ props }: { props: { post: Awaited<ReturnType<typeof getCollection<"blog">>>[number] } }) {
  const png = await generateOgImageForPost(props.post);
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
}
