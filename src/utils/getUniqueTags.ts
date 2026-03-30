import type { CollectionEntry } from "astro:content"
import { getSortedPosts } from "./getSortedPosts"

export interface TagCount {
  tag: string
  tagName: string
  count: number
}

export function getUniqueTags(posts: CollectionEntry<"blog">[]): TagCount[] {
  const sortedPosts = getSortedPosts(posts)
  const tagMap = new Map<string, number>()

  sortedPosts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      const normalizedTag = tag.toLowerCase().trim()
      tagMap.set(normalizedTag, (tagMap.get(normalizedTag) || 0) + 1)
    })
  })

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({
      tag,
      tagName: tag.charAt(0).toUpperCase() + tag.slice(1),
      count,
    }))
    .sort((a, b) => a.tag.localeCompare(b.tag))
}
