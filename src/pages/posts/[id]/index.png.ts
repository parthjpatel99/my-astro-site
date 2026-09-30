import { getCollection } from "astro:content";
import { generateOgImageForPost } from "@/utils/generateOgImages";
import getSortedPosts from "@/utils/getSortedPosts";
import { noteDate, noteMinutes, noteNumbers } from "@/utils/notes";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const numbers = noteNumbers(getSortedPosts(posts));
  return posts.map((post) => ({
    params: { id: post.id },
    props: { post, number: numbers.get(post.id) },
  }));
}

type Props = {
  post: Awaited<ReturnType<typeof getCollection<"blog">>>[number];
  number?: string;
};

export async function GET({ props }: { props: Props }) {
  const png = await generateOgImageForPost(props.post, {
    number: props.number,
    date: noteDate(props.post),
    minutes: `${noteMinutes(props.post)} READ`,
  });
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
}
