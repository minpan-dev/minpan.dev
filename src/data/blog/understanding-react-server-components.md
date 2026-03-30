---
title: "Understanding React Server Components"
description: "A deep dive into React Server Components and how they change the way we build web applications."
pubDatetime: 2026-03-10T16:00:00Z
tags: ["react", "tutorial"]
featured: false
---

React Server Components (RSC) represent a paradigm shift in how we think about rendering in React applications.

## What Are Server Components?

Server Components are React components that render exclusively on the server. They never ship to the client, which means:

- **Smaller bundle sizes**: Server-only code stays on the server
- **Direct backend access**: Query databases without an API layer
- **Automatic code splitting**: Only client components are sent to the browser

## Server vs Client Components

Here's when to use each:

| Feature        | Server Component | Client Component |
| -------------- | ---------------- | ---------------- |
| Data fetching  | ✅ Direct access | ❌ Needs API     |
| State/Effects  | ❌ Not available | ✅ Full support  |
| Event handlers | ❌ Not available | ✅ Full support  |
| Browser APIs   | ❌ Not available | ✅ Full support  |

## The `use client` Directive

Mark components that need interactivity with the `"use client"` directive:

```tsx
"use client"

import { useState } from "react"

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
}
```

## Composition Patterns

The key to using RSC effectively is proper composition. Keep server components at the top level and pass client components as children or props.

## Conclusion

React Server Components offer a powerful new model for building fast, efficient web applications. Understanding when to use server vs client components is key to getting the most out of this architecture.
