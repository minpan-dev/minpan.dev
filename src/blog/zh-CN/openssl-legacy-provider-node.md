---
author: Min Pan
pubDatetime: 2026-02-06T00:00:00Z
title: 解决 Node.js 17+ 的 OpenSSL 兼容性错误
featured: false
draft: false
tags:
  - Node.js
  - Webpack
  - 问题排查
description: 修复 digital envelope routines::unsupported 错误的方法。
---

从 Node.js v17 开始，默认使用 OpenSSL 3.0，部分旧加密算法被禁用。如果你的项目依赖（如 Webpack 4、旧版 Vue CLI、Create React App 等）仍使用这些算法，会遇到以下错误：

```
Error: error:0308010C:digital envelope routines::unsupported
```

## 受影响的项目

- Vue CLI（基于 Webpack）
- Create React App
- Angular CLI（旧版本）
- Webpack 4 项目
- 其他使用旧版打包工具的项目

## 解决方案

添加 `--openssl-legacy-provider` 启用 OpenSSL 的旧算法兼容模式。

### Windows

```json
"dev": "SET NODE_OPTIONS=--openssl-legacy-provider && npm run serve"
```

### Linux / macOS

```json
"dev": "export NODE_OPTIONS=--openssl-legacy-provider && npm run serve"
```

### 跨平台写法（推荐）

使用 `cross-env` 统一不同操作系统的环境变量设置：

```bash
npm install cross-env --save-dev
```

```json
{
  "scripts": {
    "dev": "cross-env NODE_OPTIONS=--openssl-legacy-provider npm run serve"
  }
}
```

## 更好的替代方案

1. **升级依赖** - 将 Webpack、构建工具升级到兼容 OpenSSL 3.0 的版本
2. **使用 Node.js 16.x LTS** - 该版本仍使用 OpenSSL 1.1.1
3. **仅在开发环境使用** - 避免在生产环境设置此变量
