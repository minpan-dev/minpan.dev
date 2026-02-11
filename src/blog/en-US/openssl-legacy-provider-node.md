---
author: Min Pan
pubDatetime: 2026-02-06T00:00:00Z
title: Solving OpenSSL Compatibility Errors in Node.js 17+
featured: false
draft: false
tags:
  - Node.js
  - Webpack
  - Troubleshooting
description: How to fix the digital envelope routines::unsupported error.
---

Starting from Node.js v17, OpenSSL 3.0 is used by default, and some legacy encryption algorithms are disabled. If your project dependencies (such as Webpack 4, older Vue CLI, Create React App, etc.) still use these algorithms, you will encounter the following error:

```
Error: error:0308010C:digital envelope routines::unsupported
```

## Affected Projects

- Vue CLI (Webpack-based)
- Create React App
- Angular CLI (older versions)
- Webpack 4 projects
- Other projects using older build tools

## Solutions

Add `--openssl-legacy-provider` to enable OpenSSL's legacy algorithm compatibility mode.

### Windows

```json
"dev": "SET NODE_OPTIONS=--openssl-legacy-provider && npm run serve"
```

### Linux / macOS

```json
"dev": "export NODE_OPTIONS=--openssl-legacy-provider && npm run serve"
```

### Cross-platform (Recommended)

Use `cross-env` to unify environment variable settings across different operating systems:

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

## Better Alternatives

1. **Upgrade Dependencies** - Upgrade Webpack and build tools to versions compatible with OpenSSL 3.0.
2. **Use Node.js 16.x LTS** - This version still uses OpenSSL 1.1.1.
3. **Use only in Development** - Avoid setting this variable in production environments.
