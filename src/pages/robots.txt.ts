import type { APIContext } from "astro"
import { SITE } from "@/config"

export function GET(context: APIContext) {
  const sitemapURL = new URL("sitemap-index.xml", context.site ?? SITE.website)

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  )
}
