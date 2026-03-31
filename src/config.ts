export const SITE = {
  website: "https://minpan.dev/",
  author: "Min Pan",
  profile: "https://minpan.dev/",
  desc: "The personal website of Min Pan.",
  title: "Min Pan",
  ogImage: "minpan-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 6,
  lang: "en",
  timezone: "Asia/Shanghai",
  editPost: {
    enabled: false,
    text: "Edit this page",
    url: "https://github.com/minpan-dev/minpan.dev/edit/main/",
  },
} as const

export type Project = {
  name: string
  description: string
  href: string
  language?: string
  tags?: string[]
}

export const PROJECTS: Project[] = [
  {
    name: "minpan.dev",
    description:
      "A minimal, responsive and SEO-friendly Astro blog starter with shadcn/ui components and Tailwind CSS v4.",
    href: "https://github.com/minpan-dev/minpan.dev",
    language: "TypeScript",
    tags: ["Astro", "TypeScript", "Tailwind"],
  },
  {
    name: "example-project",
    description:
      "An example open source project. Replace this with your actual GitHub repositories.",
    href: "https://github.com/minpan-dev/example-project",
    language: "TypeScript",
    tags: ["TypeScript", "Open Source"],
  },
]

export type SocialLink = {
  name: string
  href: string
  active: boolean
}

export const SOCIALS: SocialLink[] = [
  {
    name: "RSS",
    href: "/rss.xml",
    active: true,
  },
  {
    name: "GitHub",
    href: "https://github.com/minpan-dev",
    active: true,
  },
  {
    name: "X",
    href: "https://twitter.com/minpandev",
    active: true,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/minpandev",
    active: true,
  },
  {
    name: "Email",
    href: "mailto:minpan1206@gmail.com",
    active: true,
  },
]
