# minpan.dev — 项目架构文档

Min Pan 的个人博客网站，基于 **Astro 5** 构建，部署于 **Cloudflare Workers/Pages**。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Astro 5（SSG + 客户端路由 `ClientRouter`） |
| 样式 | TailwindCSS 4 + CSS 变量主题系统 |
| 字体 | Google Sans Code（通过 Astro 实验性 Fonts API） |
| 部署 | Cloudflare Workers（`@astrojs/cloudflare` 适配器，Wrangler 部署） |
| 搜索 | Algolia DocSearch |
| OG 图片 | Satori（SVG 渲染） + @resvg/resvg-js（SVG → PNG） |
| 代码高亮 | Shiki（GitHub Light/Dark 主题） |
| Markdown | remark-toc（目录生成）、remark-collapse（折叠） |
| 包管理 | pnpm 10 |
| 代码质量 | ESLint + Prettier + Husky（pre-commit lint-staged） |

---

## 目录结构

```
minpan.dev/
├── src/
│   ├── assets/            # 静态资源
│   │   ├── icons/         # SVG 图标（24 个，社交/UI 图标）
│   │   └── images/        # 图片资源
│   ├── blog/              # 博客内容（Markdown）
│   │   ├── zh-CN/         # 中文文章
│   │   └── en-US/         # 英文文章
│   ├── components/        # UI 组件（14 个 Astro 组件）
│   ├── config.ts          # 站点全局配置（SITE 常量）
│   ├── constants.ts       # 常量定义（语言、社交链接、分享链接）
│   ├── content.config.ts  # Astro Content Collections 配置
│   ├── i18n/              # 国际化翻译文件
│   │   ├── zh-CN.ts       # 中文翻译
│   │   └── en-US.ts       # 英文翻译
│   ├── layouts/           # 布局组件
│   │   ├── Layout.astro   # 全局 HTML 布局（SEO、主题、字体）
│   │   ├── Main.astro     # 内容区域包装
│   │   └── PostDetails.astro  # 文章详情布局
│   ├── pages/             # 页面路由
│   │   ├── index.astro    # 根路径语言检测重定向
│   │   ├── 404.astro      # 404 页面
│   │   ├── og.png.ts      # 站点级 OG 图片 API
│   │   ├── robots.txt.ts  # robots.txt API
│   │   └── [lang]/        # 国际化路由
│   ├── scripts/           # 客户端脚本
│   │   └── theme.ts       # 主题切换逻辑
│   ├── styles/            # 样式文件
│   │   ├── global.css     # 全局样式 + TailwindCSS + 主题变量
│   │   └── typography.css # Markdown 排版样式
│   ├── types/             # TypeScript 类型定义
│   └── utils/             # 工具函数
├── public/                # 静态公共资源（favicon 等）
├── astro.config.ts        # Astro 配置
├── wrangler.json          # Cloudflare Workers 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 项目依赖和脚本
```

---

## 核心模块详解

### 1. 国际化（i18n）

项目支持 **中文（zh-CN）** 和 **英文（en-US）** 双语，默认语言为 `zh-CN`。

**路由方案**：使用 Astro 内置 i18n 路由，所有语言都带前缀（`/zh-CN/`、`/en-US/`）。根路径 `/` 通过客户端 JS 自动检测浏览器语言并重定向。

**关键文件**：

- `src/constants.ts` — 定义 `LOCALES_SETTING` 和 `DEFAULT_LOCALE`
- `src/i18n/zh-CN.ts` / `en-US.ts` — 翻译字典（约 80+ 翻译键）
- `src/utils/i18n.ts` — i18n 工具函数：
  - `useTranslations(locale)` — 返回翻译函数 `t(key)`
  - `getCurrentLocale(astro)` — 从 Astro 对象提取当前语言
  - `normalizeLocale(locale)` — 标准化语言代码大小写
  - `getLocalizedHref(locale, path)` — 生成带语言前缀的 URL
  - `getLocalePaths(url)` — 生成所有语言的对应路径（用于 `hreflang` 标签）

**博客内容 i18n**：文章按语言目录组织（`src/blog/zh-CN/`、`src/blog/en-US/`），非默认语言的文章列表会回退到默认语言的版本。

### 2. 博客内容系统

使用 Astro Content Collections（`glob` loader），从 `src/blog/` 加载 Markdown 文件。

**文章 Schema**（定义在 `src/content.config.ts`）：

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 标题（必填） |
| `description` | `string` | 描述（必填） |
| `pubDatetime` | `Date` | 发布时间（必填） |
| `modDatetime` | `Date?` | 修改时间 |
| `author` | `string` | 作者（默认 `SITE.author`） |
| `tags` | `string[]` | 标签（默认 `['others']`） |
| `featured` | `boolean?` | 是否精选 |
| `draft` | `boolean?` | 是否草稿 |
| `ogImage` | `image \| string?` | 自定义 OG 图片 |
| `canonicalURL` | `string?` | 规范 URL |
| `hideEditPost` | `boolean?` | 隐藏编辑链接 |
| `timezone` | `string?` | 时区 |

**文章工具函数**：

- `postFilter` — 过滤草稿和未到发布时间的文章（支持 15 分钟容差）
- `getSortedPosts` — 按修改/发布时间倒序排列
- `getPostsByTag` — 按标签筛选文章
- `getUniqueTags` — 提取去重排序的标签列表
- `getPostsByGroupCondition` — 按自定义条件分组文章（用于归档页）
- `slugify` — 混合 slugify（Latin 用 `slugify`，非 Latin 如中文用 `lodash.kebabcase`）

### 3. 页面路由

| 路径 | 文件 | 说明 |
|------|------|------|
| `/` | `pages/index.astro` | 语言检测 + 重定向 |
| `/og.png` | `pages/og.png.ts` | 站点 OG 图片（API Route） |
| `/robots.txt` | `pages/robots.txt.ts` | robots.txt（API Route） |
| `/{lang}/` | `pages/[lang]/index.astro` | 首页（精选 + 最新文章） |
| `/{lang}/posts/` | `pages/[lang]/posts/` | 文章列表（分页） |
| `/{lang}/posts/{slug}/` | `pages/[lang]/posts/[...slug].astro` | 文章详情 |
| `/{lang}/tags/` | `pages/[lang]/tags/index.astro` | 标签列表 |
| `/{lang}/tags/{tag}/` | `pages/[lang]/tags/[tag]/[...page].astro` | 标签下的文章 |
| `/{lang}/archives/` | `pages/[lang]/archives/` | 归档（按年月分组） |
| `/{lang}/about/` | `pages/[lang]/about.astro` | 关于页面 |
| `/{lang}/rss.xml` | `pages/[lang]/rss.xml.ts` | RSS 订阅源 |

### 4. 主题系统

双主题方案（亮色 / 暗色），通过 HTML `data-theme` 属性切换。

**颜色变量**（CSS 自定义属性）：

| 变量 | 亮色值 | 暗色值 | 用途 |
|------|--------|--------|------|
| `--background` | `#ffffff` | `#0d1117` | 页面背景 |
| `--foreground` | `#1f2328` | `#e6edf3` | 主要文本 |
| `--muted` | `#f6f8fa` | `#161b22` | 代码块/引用背景 |
| `--muted-foreground` | `#656d76` | `#7d8590` | 次要信息 |
| `--border` | `#d0d7de` | `#30363d` | 边框/分割线 |
| `--accent` | `#0969da` | `#2f81f7` | 链接/按钮强调 |

**防 FOUC**：在 `<head>` 中内联脚本立即设置 `data-theme`，在 body 加载完成后由 `theme.ts` 管理完整的切换逻辑。

### 5. OG 图片生成

使用 **Satori** 生成 SVG 布局，再通过 **@resvg/resvg-js** 转换为 PNG。

- `src/utils/generateOgImages.ts` — 入口函数
- `src/utils/og-templates/` — SVG 模板（站点级、文章级）
- `src/utils/loadGoogleFont.ts` — 加载 Google 字体用于 OG 图片渲染
- `src/pages/og.png.ts` — 站点 OG 图片 API 端点

### 6. 组件系统

14 个 Astro 组件，全部为 `.astro` 单文件组件：

| 组件 | 说明 |
|------|------|
| `Header.astro` | 导航栏（响应式、主题切换、语言选择） |
| `Footer.astro` | 页脚（版权信息） |
| `Card.astro` | 文章卡片 |
| `Datetime.astro` | 日期时间格式化显示 |
| `Tag.astro` | 标签组件 |
| `Pagination.astro` | 分页导航 |
| `Breadcrumb.astro` | 面包屑导航 |
| `BackButton.astro` | 返回按钮 |
| `BackToTopButton.astro` | 回到顶部按钮 |
| `EditPost.astro` | GitHub 编辑链接 |
| `ShareLinks.astro` | 社交分享链接 |
| `Socials.astro` | 社交媒体链接 |
| `LinkButton.astro` | 链接按钮 |
| `LanguagePicker.astro` | 语言选择器 |

---

## 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建静态资源
pnpm preview      # 构建 + 本地 Wrangler 预览
pnpm deploy       # 部署到 Cloudflare
pnpm check        # 类型检查 + 构建验证
pnpm lint         # ESLint 检查
pnpm format       # Prettier 格式化
pnpm cf-typegen   # 生成 Cloudflare Workers 类型
```

---

## 站点配置

全局配置集中在 `src/config.ts`（`SITE` 对象）：

| 键 | 值 | 说明 |
|------|------|------|
| `website` | `https://minpan.dev` | 站点 URL |
| `author` | `Min Pan` | 作者名 |
| `postPerIndex` | `4` | 首页最新文章数量 |
| `postPerPage` | `4` | 分页每页文章数 |
| `lightAndDarkMode` | `true` | 启用明暗模式切换 |
| `showArchives` | `true` | 显示归档页面 |
| `dynamicOgImage` | `true` | 动态 OG 图片生成 |
| `editPost.url` | GitHub 仓库地址 | 文章编辑链接 |
| `timezone` | `Asia/Shanghai` | 默认时区 |

---

## SEO 特性

- **JSON-LD 结构化数据**：每篇文章自动生成 `BlogPosting` schema
- **Open Graph / Twitter Cards**：完整的社交分享元数据
- **Canonical URL**：自动生成带标准语言前缀的规范 URL
- **hreflang 标签**：每个页面声明所有语言版本
- **Sitemap**：`@astrojs/sitemap` 自动生成
- **RSS**：每个语言独立 RSS 源
- **robots.txt**：动态生成
- **Google 站点验证**：通过环境变量 `PUBLIC_GOOGLE_SITE_VERIFICATION` 配置
