---
author: Min Pan
pubDatetime: 2026-02-06T00:00:00Z
title: Prettier：一个"有态度"的代码格式化工具
featured: true
draft: false
tags:
  - 工程
  - 工具
  - Prettier
description: 用统一的规则终结代码风格之争，并把格式化融入团队协作流程。
---

Prettier 的价值不在于"更漂亮"，而在于**更一致**。它用一套规则结束格式争论，让团队把注意力放在真正重要的事上。

## 什么是 Prettier

Prettier 是一个代码格式化工具（包或插件），可自动统一代码风格，提升可读性与可维护性。

## 为什么要用 Prettier

原因只有一个：**统一代码格式风格**。常见争论点包括：

- 单引号还是双引号
- 语句末尾是否加分号
- 缩进 2 还是 4
- 每行长度 80 还是 100

很多语言自带格式化工具（如 `gofmt`、`rustfmt`），Prettier 在前端生态里承担了同样的角色。

## 怎么使用 Prettier

### 1. 通过 IDE 插件（方便）

- 安装 VS Code 的 Prettier 插件
- 将默认格式化工具改为 Prettier
- 使用 `Shift + Alt + F` 一键格式化

### 2. 通过脚本命令（团队推荐）

插件方便，但团队协作需要**可验证的统一**。建议把 Prettier 安装为开发依赖，并通过脚本统一执行。

```bash
npm i -D prettier
```

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

```bash
npm run format
```

担心成员不执行格式化？可以用 **Git hooks** 在提交前强制运行。

## 配置文件与忽略规则

Prettier 默认配置就很合理，但你仍可以用 `.prettierrc` 做少量定制：

```json
{
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "arrowParens": "always",
  "printWidth": 80
}
```

常见字段说明：

- `tabWidth`: 缩进空格数
- `semi`: 末尾是否加分号
- `singleQuote`: 是否使用单引号
- `trailingComma`: 多行是否加尾逗号
- `bracketSpacing`: 对象括号空格
- `arrowParens`: 单参数箭头函数是否加括号
- `printWidth`: 单行最大宽度

忽略规则使用 `.prettierignore`，例如：

```
node_modules
public
*.min.js
```

## 小结

Prettier 用"统一"换取沟通成本的降低，这是它被广泛接受的根本原因。
