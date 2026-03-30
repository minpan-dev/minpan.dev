import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { getSortedPosts } from "@/utils/getSortedPosts"
import { SITE } from "@/config"
import type { APIContext } from "astro"

export async function GET(context: APIContext) {
  const posts = await getCollection("blog")
  const sortedPosts = getSortedPosts(posts)

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: context.site ?? SITE.website,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDatetime,
      description: post.data.description,
      link: `/posts/${post.id}/`,
    })),
  })
}
