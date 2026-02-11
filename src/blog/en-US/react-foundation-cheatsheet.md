---
author: Min Pan
pubDatetime: 2026-02-06T00:00:00Z
title: React Foundation Cheatsheet and Key Points
featured: false
draft: false
tags:
  - React
  - Frontend
  - Foundation
description: A quick reference for JSX rules, functional components, and props passing.
---

This is a React foundation checklist for "quick review," covering JSX rules, components and props, state updates, and common Hooks.

## What is React

React is a JavaScript library for building user interfaces. It emphasizes **componentization** and **state-driven rendering**, breaking down complex UIs into maintainable structures.

## JSX Syntax Rules

1. **Define virtual DOM without quotes.**
2. **Write `class` as `className`.**
3. **Inline styles use double curly braces**: `style={{ color: 'red' }}`.
4. **JS expressions are placed inside `{}`** (used for lists, conditions, and events).
5. **Only one root node is allowed** (use `<>...</>` if necessary).
6. **Tags must be closed** (e.g., `<img />`).
7. **Lowercase for HTML, Uppercase for Components.**
8. **List rendering must have a `key`** (stable and unique, avoid using index).

## Components and Props

Functional components are functions that return JSX, offering clear semantics and flexible composition:

```jsx
function MyComponent() {
  return <h2>I am a functional component</h2>;
}
```

Props are read-only and passed down from the parent component:

```jsx
function App() {
  return (
    <Person name="Miles" age={18}>
      <div>children</div>
    </Person>
  );
}

function Person({ name, age, children }) {
  return (
    <ul>
      <li>Name: {name}</li>
      <li>Age: {age}</li>
      {children}
    </ul>
  );
}
```

### Child to Parent (Callback)

```jsx
function App() {
  const [msg, setMsg] = useState('');
  return (
    <div>
      {msg}
      <Son onChange={setMsg} />
    </div>
  );
}

function Son({ onChange }) {
  return <button onClick={() => onChange('child data')}>Send</button>;
}
```

## Key Points for State Updates

- **Use the spread operator for object/array updates**, do not modify the original object directly.
- When updates depend on the old value, use **functional updates**.

```jsx
setForm((prev) => ({ ...prev, name: 'hello' }));
setCount((c) => c + 1);
```

## Common Hooks Mnemonic

- **`useState`**: State management.
- **`useEffect`**: Side effects (requests, subscriptions, DOM operations).
- **`useRef`**: Persistent references or DOM access.
- **`useMemo` / `useCallback`**: Cache calculation results or functions to reduce unnecessary re-renders.

### `useEffect` Dependency Rules

- No dependencies: Runs after every render.
- `[]`: Runs only once after the initial mount.
- `[a, b]`: Runs only when dependencies change.

## Common Pitfalls

- Unstable `key` causing list confusion.
- Modifying state directly causing the view not to update.
- Missing `useEffect` dependencies leading to out-of-sync data.

## Summary

1. JSX is stricter but clearer.
2. Components are responsible for splitting UI and reusing logic.
3. Data flow is unidirectional by default: parent to child, while children affect parents via callbacks.
