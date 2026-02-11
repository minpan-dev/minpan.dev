---
author: Min Pan
pubDatetime: 2026-02-06T00:00:00Z
title: 'Prettier: An Opinionated Code Formatter'
featured: true
draft: false
tags:
  - Engineering
  - Tools
  - Prettier
description: End code style debates with unified rules and integrate formatting into team workflows.
---

The value of Prettier is not that it's "prettier," but that it's **more consistent**. It ends style debates with a set of rules, allowing teams to focus on what really matters.

## What is Prettier

Prettier is a code formatting tool (package or plugin) that automatically unifies code style, improving readability and maintainability.

## Why Use Prettier

There is only one reason: **unify code formatting style**. Common points of debate include:

- Single or double quotes
- Whether to add semicolons at the end of statements
- Indentation of 2 or 4 spaces
- Line length of 80 or 100

Many languages come with built-in formatters (like `gofmt`, `rustfmt`), and Prettier plays the same role in the frontend ecosystem.

## How to Use Prettier

### 1. Via IDE Plugin (Convenient)

- Install the Prettier plugin for VS Code.
- Set Prettier as the default formatter.
- Use `Shift + Alt + F` to format with one click.

### 2. Via Script Command (Team Recommended)

Plugins are convenient, but team collaboration requires **verifiable consistency**. It is recommended to install Prettier as a dev dependency and execute it uniformly via scripts.

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

Worried that members might not run the formatter? Use **Git hooks** to force it before committing.

## Configuration and Ignore Rules

Prettier's default configuration is reasonable, but you can still make minor customizations using `.prettierrc`:

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

Explanation of common fields:

- `tabWidth`: Number of spaces per indentation level.
- `semi`: Whether to add semicolons at the end of statements.
- `singleQuote`: Whether to use single quotes instead of double quotes.
- `trailingComma`: Whether to add trailing commas in multi-line structures.
- `bracketSpacing`: Spaces between brackets in objects.
- `arrowParens`: Whether to include parentheses around a sole arrow function parameter.
- `printWidth`: Maximum line length.

Use `.prettierignore` for ignore rules, for example:

```
node_modules
public
*.min.js
```

## Summary

Prettier trades "unification" for lower communication costs, which is the fundamental reason for its wide adoption.
