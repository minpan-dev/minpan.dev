import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import { rehypeImgLazy } from "./src/utils/rehypeImgLazy.mjs"

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://minpan.dev",
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["react", "react-dom/client", "react/jsx-runtime"],
    },
  },
  integrations: [react(), mdx(), sitemap()],
  image: {
    // sharp is installed; Astro uses it automatically for local image optimization
    // This produces WebP/AVIF output and adds width/height to prevent CLS
  },
  markdown: {
    rehypePlugins: [rehypeImgLazy],
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      wrap: true,
    },
  },
})
