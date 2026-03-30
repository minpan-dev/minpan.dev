import { defineCollection } from "astro:content"
import { z } from "astro/zod"
import { glob } from "astro/loaders"
import { SITE } from "@/config"

export const BLOG_PATH = "src/data/blog"

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: () =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: z.string().optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
    }),
})

export const collections = { blog }
