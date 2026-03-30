import type { CollectionEntry } from "astro:content"
import { getSortedPosts } from "./getSortedPosts"

export function getPostsByTag(
  posts: CollectionEntry<"blog">[],
  tag: string
): CollectionEntry<"blog">[] {
  return getSortedPosts(posts).filter((post) =>
    post.data.tags.some(
      (t) => t.toLowerCase().trim() === tag.toLowerCase().trim()
    )
  )
}
