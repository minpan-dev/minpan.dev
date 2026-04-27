# AGENTS.md

## Project Overview

**minpan.dev** — Min Pan 的个人网站与博客，基于 Astro 6 构建，使用 React 处理交互式组件，Tailwind CSS v4 进行样式管理，shadcn/ui（base-nova 风格，底层为 @base-ui/react）提供 UI 原语。站点以静态方式输出，部署在 Cloudflare Worker 上。

- **线上地址:** https://minpan.dev
- **仓库:** https://github.com/minpan-dev/minpan.dev

---

## Build & Dev Commands

| 命令             | 说明                                                   |
| ---------------- | ------------------------------------------------------ |
| `pnpm dev`       | 启动本地开发服务器                                     |
| `pnpm build`     | 构建生产版本（`astro build` + `pagefind --site dist`） |
| `pnpm deploy`    | 部署到 Cloudflare（Wrangler）                          |
| `pnpm lint`      | ESLint 检查                                            |
| `pnpm format`    | Prettier 格式化                                        |
| `pnpm typecheck` | 类型检查（`astro check`）                              |

- **包管理器:** pnpm (>=10.33.0)
- **Node 版本:** >=22
- **无测试套件**。Husky + lint-staged 在 commit 时自动执行格式化和 lint 检查。

---

## Tech Stack

- **Framework:** Astro 6（静态输出）
- **UI 交互:** React 19
- **样式:** Tailwind CSS v4 + `@tailwindcss/typography`
- **UI 组件库:** shadcn/ui（`base-nova` 风格，基于 `@base-ui/react`，非 Radix）
- **字体:** Geist Variable（`@fontsource-variable/geist`）
- **搜索:** Pagefind
- **部署:** Cloudflare Worker（Wrangler）
- **TypeScript:** ~6.0

---

## Architecture

### 目录结构

```
src/
├── components/          # 页面级组件
│   ├── ui/              # shadcn/ui 原语组件（@base-ui/react）
│   ├── *.astro          # Astro 静态组件（Footer, PostCard, ShareLinks, TableOfContents 等）
│   └── *.tsx            # React 交互组件（ThemeToggle, SearchDialog, MobileNav, Header 等）
├── config.ts            # 全局常量：站点信息、项目列表、社交链接
├── content.config.ts    # Astro 内容集合定义（blog）
├── data/
│   └── blog/            # Markdown 博客文章
├── layouts/
│   ├── Layout.astro     # 基础布局（SEO meta、OG 标签、主题脚本）
│   ├── Main.astro       # 主内容区域包装
│   └── PostLayout.astro # 博客文章布局（文章头、目录、prose 样式）
├── pages/               # 基于文件的路由
│   ├── index.astro      # 首页
│   ├── about.astro      # 关于页
│   ├── search.astro     # 搜索页
│   ├── 404.astro        # 404 页面
│   ├── posts/           # 博客列表 + [slug] 动态路由
│   ├── projects/        # 项目展示页
│   ├── tags/            # 标签页 + [tag] 动态路由
│   ├── rss.xml.ts       # RSS 订阅
│   └── robots.txt.ts    # robots.txt
├── styles/
│   └── global.css       # 全局样式（Tailwind v4 主题、CSS 变量、布局系统）
└── utils/               # 工具函数
    ├── cn.ts            # Tailwind 类名合并工具
    ├── formatDate.ts    # 日期格式化
    ├── getPostsByTag.ts # 按标签筛选文章
    ├── getReadingTime.ts# 阅读时间估算
    ├── getSortedPosts.ts# 文章排序
    ├── getUniqueTags.ts # 提取唯一标签
    ├── groupBy.ts       # 通用分组函数
    └── rehypeImgLazy.mjs# rehype 图片懒加载插件
```

### 内容层

博客文章为 Markdown 文件，存放在 `src/data/blog/`。集合 schema 在 `src/content.config.ts` 中使用 Astro `glob` loader 定义。

**Frontmatter 字段：**

| 字段           | 类型     | 必填 | 说明                      |
| -------------- | -------- | ---- | ------------------------- |
| `title`        | string   | ✅   | 文章标题                  |
| `description`  | string   | ✅   | 文章描述                  |
| `pubDatetime`  | date     | ✅   | 发布日期                  |
| `tags`         | string[] | ❌   | 标签（默认 `["others"]`） |
| `author`       | string   | ❌   | 作者（默认站点作者）      |
| `featured`     | boolean  | ❌   | 是否精选                  |
| `draft`        | boolean  | ❌   | 是否为草稿                |
| `modDatetime`  | date     | ❌   | 修改日期                  |
| `ogImage`      | string   | ❌   | OG 图片路径               |
| `canonicalURL` | string   | ❌   | 标准 URL                  |

### 组件设计

- **Astro 组件 (`.astro`):** 处理页面级 UI，无需客户端状态（Footer, PostCard, ShareLinks, TableOfContents 等）
- **React 组件 (`.tsx`):** 需要客户端状态的交互式小部件，通过 `client:load` 激活（ThemeToggle, SearchDialog, MobileNav, Header）
- **shadcn/ui 组件:** 位于 `src/components/ui/`，基于 `@base-ui/react`（**不是 Radix**）。添加新组件使用 `npx shadcn@latest add <component>`

---

## Key Conventions

### Path Alias

`@/*` 映射到 `./src/*`（在 `tsconfig.json` 和 `components.json` 中配置）。

### 样式规范

- **Tailwind v4:** 入口文件为 `src/styles/global.css`，使用 `@import "tailwindcss"` 和 `@theme inline`
- **颜色空间:** OKLch
- **暗黑模式:** 通过 `<html>` 上的 `.dark` 类切换，使用 `@custom-variant dark (&:is(.dark *))` 自定义变体
- **类名合并:** 使用 `cn()` 工具函数（来自 `@/utils/cn`）。Prettier 配置了在 `cn()` 和 `cva()` 调用中排序 Tailwind 类
- **字体:** Geist Variable 作为默认 sans-serif 字体

### 格式化规范（Prettier）

- 无分号
- 双引号
- 2 空格缩进
- 尾随逗号：es5
- `.astro` 文件使用 `astro` parser
- 插件：`prettier-plugin-astro`, `prettier-plugin-tailwindcss`

### Linting 规范（ESLint）

- Flat config 格式
- 仅针对 `.ts` / `.tsx` 文件
- 包含 TypeScript、React Hooks、React Refresh 规则
- 忽略 `dist` 和 `.astro` 目录

### Git 规范

- 使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范编写 commit message
- Husky + lint-staged 在 commit 时自动执行格式化和 lint 检查

### 站点配置

全局常量（作者、标题、分页设置、时区等）集中在 `src/config.ts` 中管理。

---

## Deployment

- **平台:** Cloudflare Worker
- **构建产物:** `dist/` 目录
- **部署命令:** `pnpm deploy`（使用 Wrangler）
- **配置文件:** `wrangler.jsonc`

---

## License

- **源代码:** MIT
- **网站内容（文章、文字、图片）:** CC BY-NC-SA 4.0
