# DESIGN.md

minpan.dev 的设计系统文档，基于项目实际使用的 token、组件和模式编写。

---

## 设计理念

以内容为核心的极简设计。通过精确的排版层级、克制的色彩和结构化的网格线（gridline）边框营造"数字秩序感"，让读者聚焦于文章内容本身。支持亮色/暗色双模式，视觉风格保持一致。

---

## 色彩系统

所有颜色使用 **OKLch** 色彩空间定义，通过 CSS 自定义属性（Custom Properties）在 `src/styles/global.css` 中管理。

### 语义 Token

| Token                  | Light                       | Dark                        | 用途                       |
| ---------------------- | --------------------------- | --------------------------- | -------------------------- |
| `--background`         | `oklch(1 0 0)`              | `oklch(0.145 0 0)`          | 页面背景                   |
| `--foreground`         | `oklch(0.145 0 0)`          | `oklch(0.985 0 0)`          | 主文字                     |
| `--card`               | `oklch(1 0 0)`              | `oklch(0.205 0 0)`          | 卡片背景                   |
| `--card-foreground`    | `oklch(0.145 0 0)`          | `oklch(0.985 0 0)`          | 卡片文字                   |
| `--primary`            | `oklch(0.205 0 0)`          | `oklch(0.922 0 0)`          | 主要强调色                 |
| `--primary-foreground` | `oklch(0.985 0 0)`          | `oklch(0.205 0 0)`          | 主色上的文字               |
| `--secondary`          | `oklch(0.97 0 0)`           | `oklch(0.269 0 0)`          | 次要背景                   |
| `--muted`              | `oklch(0.97 0 0)`           | `oklch(0.269 0 0)`          | 弱化背景                   |
| `--muted-foreground`   | `oklch(0.556 0 0)`          | `oklch(0.708 0 0)`          | 弱化文字（日期、元信息）   |
| `--accent`             | `oklch(0.97 0 0)`           | `oklch(0.269 0 0)`          | 交互态背景（hover/active） |
| `--border`             | `oklch(0.922 0 0)`          | `oklch(1 0 0 / 10%)`        | 边框                       |
| `--input`              | `oklch(0.922 0 0)`          | `oklch(1 0 0 / 15%)`        | 输入框边框                 |
| `--ring`               | `oklch(0.708 0 0)`          | `oklch(0.556 0 0)`          | 聚焦环                     |
| `--destructive`        | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | 危险/错误                  |

### 特殊语义色

| Token               | Light                      | Dark                       | 用途                         |
| ------------------- | -------------------------- | -------------------------- | ---------------------------- |
| `--color-gridline`  | `oklch(0.916 0.01 264)`    | `oklch(0.24 0.01 264)`     | 布局网格线（带微量蓝色色相） |
| `--color-selection` | `oklch(0.8 0.5 264 / 25%)` | `oklch(0.5 0.5 264 / 40%)` | 文本选中颜色                 |

### 调色板特征

- **中性灰为主**：所有核心 token 的 chroma 均为 `0`（纯灰），设计风格极简克制
- **色相仅用于功能性元素**：网格线和选中色使用 hue `264`（蓝紫色相），提供微妙的品牌识别
- **暗色模式非简单反转**：border 和 input 使用透明白色（`oklch(1 0 0 / 10%)`），比纯灰色更自然

---

## 排版

### 字体

- **Sans-serif（默认）：** Geist Variable（`@fontsource-variable/geist`）
- **Heading：** 继承 `--font-sans`（即 Geist Variable）
- **Fallback：** `system-ui, sans-serif`

### 排版层级

| 场景                     | 类名                   | 大小               | 字重                 | 间距                       |
| ------------------------ | ---------------------- | ------------------ | -------------------- | -------------------------- |
| 文章标题                 | `text-3xl sm:text-4xl` | 1.875rem / 2.25rem | `font-bold`          | `tracking-tight`           |
| 卡片标题                 | `text-lg`              | 1.125rem           | `font-semibold`      | `tracking-tight`           |
| 正文                     | prose 默认             | 1rem               | normal               | —                          |
| 元信息（日期、阅读时间） | `text-sm` / `text-xs`  | 0.875rem / 0.75rem | normal               | —                          |
| 导航链接                 | `text-sm` (`0.875rem`) | 0.875rem           | `font-medium`（500） | —                          |
| Logo                     | —                      | `1.125rem`         | `font-weight: 700`   | `letter-spacing: -0.025em` |

### 长文排版（Prose）

使用 `@tailwindcss/typography` 插件，配置：

```
prose max-w-none prose-neutral dark:prose-invert
prose-headings:font-semibold prose-headings:tracking-tight
prose-a:text-primary prose-a:underline-offset-4
```

---

## 圆角

基于 `--radius: 0.625rem`（10px），通过倍数缩放：

| Token          | 值         | 换算 | 用途                 |
| -------------- | ---------- | ---- | -------------------- |
| `--radius-sm`  | `0.375rem` | 6px  | 小元素               |
| `--radius-md`  | `0.5rem`   | 8px  | 按钮、导航链接、Logo |
| `--radius-lg`  | `0.625rem` | 10px | 代码块               |
| `--radius-xl`  | `0.875rem` | 14px | 卡片、MobileNav 面板 |
| `--radius-2xl` | `1.125rem` | 18px | —                    |

---

## 布局系统

### 结构层级

```
body
└── .RootLayout                    → 最外层，含 padding-inline 和网格线
    └── .RootLayoutContainer       → 居中容器，max-width 限制
        ├── Header                 → 绝对定位（桌面）/ 固定定位（移动端）
        ├── .RootLayoutContent     → flex-grow 的主内容区
        │   ├── Main               → 内容宽度约束
        │   └── Footer
        └── .RootLayoutFooter      → 桌面端底部占位
```

### 关键尺寸

| Token / 值                                       | 用途                              |
| ------------------------------------------------ | --------------------------------- |
| `--header-height: 4rem`（64px）                  | Header 和 Footer 高度             |
| `--breakpoint-max-layout-width: 89rem`（1424px） | 最大布局宽度                      |
| `max-w-5xl`（64rem / 1024px）                    | 默认主内容区宽度（`size="wide"`） |
| `max-w-3xl`（48rem / 768px）                     | 窄内容区宽度（`size="content"`）  |
| `padding-inline: 1rem / 1.5rem`                  | 水平内边距（移动端 / 桌面端）     |

### 网格线装饰

桌面端（≥ 64rem）布局容器显示装饰性网格线：

- **水平线**：Header 下方和 Footer 上方各一条 1px 线，颜色 `--color-gridline`
- **垂直线**：内容容器左右各一条 1px 线
- 这些线仅是装饰性的（CSS pseudo-elements），不影响布局

### 响应式断点

| 断点 | 值                | 用途                  |
| ---- | ----------------- | --------------------- |
| `sm` | `40rem`（640px）  | 移动端/桌面端导航切换 |
| `lg` | `64rem`（1024px） | 网格线布局激活        |

---

## 暗色模式

- **切换方式：** 通过 `<html>` 元素的 `.dark` 类控制
- **Tailwind 变体：** `@custom-variant dark (&:is(.dark *))`
- **持久化：** `localStorage.setItem("theme", "light" | "dark")`
- **防闪烁：** 在 `<head>` 中使用 `is:inline` 脚本，在 DOM 渲染前读取 localStorage 并设置 `.dark` 类
- **系统偏好回退：** 当 localStorage 无值时，使用 `window.matchMedia("(prefers-color-scheme: dark)")`
- **theme-color meta：** 动态同步为 `#ffffff`（亮色）或 `#0a0a0a`（暗色）

---

## 交互模式

### 过渡时长

- **颜色/背景过渡：** `0.15s`（导航链接、图标按钮）
- **卡片 transform：** `duration-150 ease-out`
- **MobileNav 出场：** `500ms`（`--ease-out-fast`）
- **MobileNav 退场：** `200ms`（`--ease-in-slow`）

### 自定义缓动

```css
--ease-out-fast: cubic-bezier(0.45, 1.005, 0, 1.005);
--ease-in-slow: cubic-bezier(0.375, 0.015, 0.545, 0.455);
```

### Hover 与 Active

- **导航链接 hover：** `color: --foreground` + `background: --accent`
- **卡片 hover：** `-translate-y-0.5`（上移 2px）+ `shadow-md` + `ring-primary/30`
- **卡片标题 hover：** `color` 过渡到 `--primary`
- **触摸设备适配：** 使用 `@media (hover: hover)` 区分指针设备和触摸设备，触摸设备使用 `:active` 替代 `:hover`

### 聚焦样式

- **聚焦环：** `outline: 2px solid var(--ring)` + `outline-offset: -2px`
- **Skip to content：** 隐藏在屏幕顶部外，`:focus` 时滑入

---

## 组件模式

### 分层策略

| 层       | 文件类型                  | 职责                                                |
| -------- | ------------------------- | --------------------------------------------------- |
| UI 原语  | `src/components/ui/*.tsx` | shadcn/ui 组件（基于 @base-ui/react）               |
| 页面组件 | `src/components/*.astro`  | 静态 UI（Footer, PostCard, ShareLinks 等）          |
| 交互组件 | `src/components/*.tsx`    | 需要客户端状态（Header, ThemeToggle, SearchDialog） |

### 卡片（Card）

- 背景：`bg-card`
- 边框：`ring-1 ring-foreground/10`（细微环形边框）
- 圆角：`rounded-xl`
- Footer：带 `border-t` + `bg-muted/50`
- Hover：`shadow-md` + `ring-primary/30`

### 标签（Tag / Badge）

- 使用 shadcn Badge `variant="outline"`
- 两种尺寸：`sm`（`px-2 py-0.5 text-xs`）和 `default`（`px-2.5 py-1 text-sm`）
- 格式：`#TagName`（首字母大写）

### 导航（Header）

- **移动端（< 40rem）：** 固定定位，底部 `box-shadow: inset 0 -1px var(--color-gridline)`
- **桌面端（≥ 40rem）：** 静态定位，无阴影，透明背景（融入网格线布局）
- **Active 状态：** `data-active` 属性 → `color: --accent-foreground` + `bg: --accent`

### MobileNav

- **入场动画：** 从底部滑入（`translateY(100dvh)`），带模糊效果
- **面板样式：** 顶部 `border-radius: --radius-xl`，popover 背景 + 阴影
- **暗色模式阴影简化：** 仅保留 `0 0 0 1px var(--border)`
- **大屏适配（≥ 40rem）：** 浮动居中卡片样式

---

## 代码高亮

使用 Shiki 双主题，通过 CSS 类切换：

- **亮色：** `github-light`
- **暗色：** `github-dark`

代码块样式：

```css
border-radius: var(--radius);
padding: 1rem 1.25rem;
font-size: 0.875em;
line-height: 1.7;
```

代码块内置**复制按钮**（右上角，hover 时显示）。

---

## 文件参考

| 文件                              | 职责                                           |
| --------------------------------- | ---------------------------------------------- |
| `src/styles/global.css`           | 设计 token 定义、布局系统、Shiki 主题切换      |
| `src/components/ui/`              | shadcn/ui 原语组件                             |
| `src/components/Header.css`       | Header 样式（响应式、状态）                    |
| `src/components/MobileNav.css`    | MobileNav 动画和样式                           |
| `src/components/SearchDialog.css` | 搜索对话框样式                                 |
| `src/layouts/Layout.astro`        | 基础布局、SEO meta、主题初始化脚本             |
| `src/layouts/PostLayout.astro`    | 文章布局、prose 样式、代码块增强               |
| `src/utils/cn.ts`                 | Tailwind 类名合并（`clsx` + `tailwind-merge`） |
