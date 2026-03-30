# Blog Optimization Roadmap

> 审计日期：2026-03-26
> 当前总体评分：8/10

## 现状总结

### ✅ 已具备的最佳实践

| 功能                          | 状态 | 备注                                               |
| ----------------------------- | ---- | -------------------------------------------------- |
| SEO Meta / OG / Twitter Cards | ✅   | `Layout.astro` 中完整实现                          |
| Canonical URL                 | ✅   | 支持自定义和自动生成                               |
| Sitemap                       | ✅   | `@astrojs/sitemap` 集成                            |
| RSS Feed                      | ✅   | `/rss.xml` 自动生成                                |
| Robots.txt                    | ✅   | 正确指向 sitemap                                   |
| 草稿过滤                      | ✅   | 全站一致，`getSortedPosts` 统一处理                |
| 分页                          | ✅   | `Pagination.tsx` + 动态路由                        |
| 暗色模式                      | ✅   | localStorage + 系统偏好，无闪烁（FOUC prevention） |
| 全文搜索                      | ✅   | Pagefind 集成，150ms 防抖，键盘导航                |
| 无障碍访问                    | ✅   | skip-to-content、ARIA labels、语义化 HTML          |
| 前/后文章导航                 | ✅   | `PrevNextNav.tsx`                                  |
| 面包屑导航                    | ✅   | `BreadcrumbNav.tsx`                                |
| 社交分享                      | ✅   | Twitter、LinkedIn、Reddit、Email                   |
| TypeScript 严格模式           | ✅   | `astro/tsconfigs/strict` + `strictNullChecks`      |
| 代码质量工具链                | ✅   | ESLint + Prettier + Husky + lint-staged            |
| 404 页面                      | ✅   | 统一布局，返回首页链接                             |

---

## Phase 1: 高优先级

### 1.1 添加代码语法高亮（Shiki）

- **问题：** 博客文章代码块无语法着色，显示为纯文本
- **方案：** 配置 Astro 内置 Shiki 高亮器，支持 light/dark 双主题
- **涉及文件：**
  - `astro.config.mjs` — 添加 `markdown.shikiConfig` 配置
  - `src/styles/global.css` — 调整 `pre`/`code` 在暗色模式下的样式
- **验证：** 构建后检查含代码块的文章是否正确着色，暗色/亮色模式切换正常
- [x] 完成

### 1.2 优化 React 组件水合策略

- **问题：** 所有 React 组件均使用 `client:load` 立即加载，影响首屏性能（FCP/TTI）
- **方案：**

  | 组件              | 当前          | 建议                  | 原因             |
  | ----------------- | ------------- | --------------------- | ---------------- |
  | `ThemeToggle`     | `client:load` | `client:load` ✅ 保持 | 防止主题闪烁     |
  | `Header` (含搜索) | `client:load` | `client:load` ✅ 保持 | 包含 ThemeToggle |
  | `ScrollProgress`  | `client:load` | → `client:visible`    | 滚动时才需要     |
  | `BackToTop`       | `client:load` | → `client:visible`    | 滚动后才可见     |

- **涉及文件：**
  - `src/layouts/PostLayout.astro` — 修改 `ScrollProgress` 和 `BackToTop` 的指令
- **验证：** `pnpm build` 无错误；Lighthouse Performance 评分对比改善
- [x] 完成

### 1.3 添加 JSON-LD 结构化数据

- **问题：** 完全缺失结构化数据，无法在搜索引擎获得富摘要（Rich Snippets）
- **方案：** 添加 `<script type="application/ld+json">` 到布局中
  - 首页：`WebSite` schema
  - 文章页：`BlogPosting` schema（headline、author、datePublished、dateModified、image、description）
  - 可选：`BreadcrumbList` schema
- **涉及文件：**
  - `src/layouts/Layout.astro` — 首页 WebSite schema
  - `src/layouts/PostLayout.astro` — BlogPosting schema
- **验证：** [Google Rich Results Test](https://search.google.com/test/rich-results) 验证; `pnpm build` 无错误
- [x] 完成

### 1.4 添加阅读时间

- **问题：** 博客文章缺少阅读时间显示，这是读者最常用的参考指标之一
- **方案：** 使用 `reading-time` npm 包或自行实现（中文按 300 字/分钟，英文按 200 词/分钟）
- **涉及文件：**
  - 新增 `src/utils/getReadingTime.ts` — 阅读时间计算工具
  - `src/layouts/PostLayout.astro` — 在日期旁展示阅读时间
  - `src/components/PostCard.astro` — 可选：卡片上显示阅读时间
- **验证：** 文章页面显示合理的阅读时间数值
- [x] 完成

---

## Phase 2: 中优先级

### 2.1 添加文章目录（Table of Contents）

- **问题：** 长文章缺少导航目录
- **方案：** 利用 Astro 的 `render()` 返回值中的 `headings` 自动提取标题生成锚点目录
- **涉及文件：**
  - 新增 `src/components/TableOfContents.astro`（或 `.tsx`）
  - `src/layouts/PostLayout.astro` — 集成 ToC（侧边栏或文章顶部折叠区域）
  - `src/pages/posts/[slug]/index.astro` — 传递 headings 数据
- **验证：** 含多级标题的文章正确渲染 ToC；点击锚点滚动定位正常
- [x] 完成

### 2.2 图片优化

- **问题：** 未使用 Astro `<Image />` 组件，缺少响应式图片、格式转换、懒加载
- **方案：**
  - 确保 `astro.config.mjs` 图片服务配置（`sharp` 已在依赖中）
  - 博客文章中使用相对路径引用图片，Astro 自动优化
  - 为 prose 容器中的图片添加 `loading="lazy"` 默认行为
- **涉及文件：**
  - `astro.config.mjs` — 确认 image service 配置
  - 文章 Markdown 文件 — 使用优化的图片引用方式
- **验证：** 构建输出包含 WebP/AVIF 格式图片；`<img>` 标签含 `srcset` 和 `loading="lazy"`
- [x] 完成

### 2.3 补充缺失的 Meta 标签

- **问题：** 缺少部分有助于社交分享和浏览器体验的 meta 标签
- **方案：** 在 `Layout.astro` 的 `<head>` 中添加：
  - `<meta property="og:image:width" content="1200">`
  - `<meta property="og:image:height" content="630">`
  - `<meta property="og:site_name" content="{SITE.title}">`
  - `<meta property="og:locale" content="zh_CN">` (或 `en_US`)
  - `<meta name="theme-color">` (根据暗色/亮色模式动态设置)
- **涉及文件：**
  - `src/layouts/Layout.astro`
- **验证：** [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 和 [Twitter Card Validator](https://cards-dev.twitter.com/validator) 验证
- [x] 完成

### 2.4 搜索结果 XSS 安全加固

- **问题：** `SearchDialog.tsx` 中使用 `dangerouslySetInnerHTML={{ __html: result.excerpt }}` 渲染 Pagefind 摘要，存在潜在 XSS 风险
- **方案：**
  - 安装 `dompurify`（+ `@types/dompurify`）
  - 在渲染前用 `DOMPurify.sanitize()` 清理 HTML
  - 配置允许 `<mark>` 标签（保留 Pagefind 高亮功能）
- **涉及文件：**
  - `src/components/SearchDialog.tsx` — 添加 sanitize 逻辑
- **验证：** 搜索结果高亮正常；尝试注入 `<script>` 标签不执行
- [x] 完成

---

## Phase 3: 锦上添花

### 3.1 添加 Web App Manifest

- **问题：** 缺少 PWA 支持文件
- **方案：**
  - 创建 `public/manifest.json`（name、icons 192x192/512x512、theme_color、background_color、display）
  - 创建 `public/apple-touch-icon.png`（180x180）
  - 在 `Layout.astro` 添加 `<link rel="manifest">`、`<link rel="apple-touch-icon">`
- **验证：** Lighthouse PWA 审计通过
- [ ] 完成

### 3.2 添加相关文章推荐

- **问题：** 文章页底部无相关内容推荐，读者容易流失
- **方案：** 根据共同标签数量匹配相关文章，取 top 3
- **涉及文件：**
  - 新增 `src/utils/getRelatedPosts.ts`
  - `src/pages/posts/[slug]/index.astro` 或 `PostLayout.astro` — 渲染相关文章区域
- **验证：** 文章底部展示相关文章，且不包含当前文章本身
- [ ] 完成

### 3.3 添加 Content Security Policy

- **问题：** 无 CSP 安全响应头
- **方案：** 根据部署平台配置（项目使用 Cloudflare Workers，见 `wrangler.jsonc`）
- **涉及文件：**
  - `wrangler.jsonc` 或新增 `public/_headers`
- **验证：** 浏览器 DevTools Console 无 CSP 违规警告
- [ ] 完成

### 3.4 改进 404 页面

- **问题：** 当前 404 页只有返回首页链接，用户体验可提升
- **方案：** 加入搜索框或热门文章推荐，帮助用户找到想要的内容
- **涉及文件：**
  - `src/pages/404.astro`
- [ ] 完成

### 3.5 添加页面分析 (Analytics)

- **问题：** 无流量分析工具，无法了解读者行为
- **方案：** 集成隐私友好的分析工具（如 Cloudflare Web Analytics、Umami、Plausible）
- **涉及文件：**
  - `src/layouts/Layout.astro` — 添加分析脚本
- [ ] 完成

---

## 全局验证清单

- [ ] `pnpm build` — 无构建错误
- [ ] `pnpm typecheck` — 无类型错误
- [ ] `pnpm lint` — 无 lint 错误
- [ ] Lighthouse 审计 ≥ 90 分（Performance、SEO、Accessibility、Best Practices）
- [ ] Google Rich Results Test — JSON-LD 结构化数据验证通过
- [ ] 移动端响应式 — 各断点布局正常
- [ ] 暗色/亮色模式 — 所有页面切换正常，无闪烁
- [ ] 搜索功能 — 构建后搜索结果正确
- [ ] RSS 订阅 — Feed 验证器通过
