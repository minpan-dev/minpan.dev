import type { CollectionEntry } from "astro:content"

export function getSortedPosts(posts: CollectionEntry<"blog">[]) {
  return posts
    .filter(({ data }) => !data.draft)
    .sort(
      (a, b) =>
        new Date(b.data.pubDatetime).getTime() -
        new Date(a.data.pubDatetime).getTime()
    )
}

export function getFeaturedPosts(posts: CollectionEntry<"blog">[]) {
  return getSortedPosts(posts).filter(({ data }) => data.featured)
}
