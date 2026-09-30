import type { CollectionEntry } from "astro:content";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { SITE } from "@/config";
import { calculateReadingTime } from "./readingTime";

dayjs.extend(utc);
dayjs.extend(timezone);

type Post = CollectionEntry<"blog">;

/**
 * Field-note numbers: the oldest published post is No. 01.
 * `posts` should already be filtered (see getSortedPosts).
 */
export function noteNumbers(posts: Post[]): Map<string, string> {
  const chronological = [...posts].sort(
    (a, b) => a.data.pubDatetime.valueOf() - b.data.pubDatetime.valueOf()
  );
  return new Map(chronological.map((p, i) => [p.id, String(i + 1).padStart(2, "0")]));
}

/** "MAR 29, 2026" in the post's (or site's) timezone */
export function noteDate(post: Post): string {
  const d = dayjs(post.data.pubDatetime).utc();
  // Date-only frontmatter (`2026-01-01`) parses as UTC midnight — show that date as written
  const dateOnly = d.hour() === 0 && d.minute() === 0 && d.second() === 0;
  return (dateOnly ? d : d.tz(post.data.timezone || SITE.timezone)).format("MMM D, YYYY").toUpperCase();
}

/** "6 MIN" */
export function noteMinutes(post: Post): string {
  return calculateReadingTime(post.body ?? "").replace(" read", "").toUpperCase();
}
