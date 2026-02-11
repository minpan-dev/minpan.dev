---
author: Min Pan
pubDatetime: 2026-02-06T00:00:00Z
title: React 基础语法速查与要点整理
featured: false
draft: false
tags:
  - React
  - 前端
  - 基础
description: 把 JSX 规则、函数组件与 props 传递方式压缩成一份可快速回看的清单。
---

这是一份面向"快速回看"的 React 基础清单，覆盖 JSX 规则、组件与 props、状态更新、常用 Hooks。

## React 是什么

React 是用于构建用户界面的 JavaScript 库。它强调**组件化**与**状态驱动渲染**，把复杂 UI 拆成可维护的结构。

## JSX 语法规则

1. **定义虚拟 DOM 不写引号**
2. **`class` 写成 `className`**
3. **内联样式用双大括号**：`style={{ color: 'red' }}`
4. **JS 表达式放在 `{}` 中**（列表、条件、事件都靠它）
5. **只能有一个根节点**（必要时用 `<>...</>`）
6. **标签必须闭合**（如 `<img />`）
7. **小写是 HTML，大写是组件**
8. **列表渲染必须有 `key`**（稳定且唯一，避免用索引）

## 组件与 props

函数组件就是返回 JSX 的函数，语义清晰、组合灵活：

```jsx
function MyComponent() {
  return <h2>我是一个函数式组件</h2>;
}
```

props 只读，数据从父组件传入：

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
      <li>姓名：{name}</li>
      <li>年龄：{age}</li>
      {children}
    </ul>
  );
}
```

### 子传父（回调）

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
  return <button onClick={() => onChange('子组件数据')}>发送</button>;
}
```

## 状态更新要点

- **对象/数组更新要用展开运算符**，不要直接修改原对象。
- 多次更新依赖旧值时，用**函数式更新**。

```jsx
setForm((prev) => ({ ...prev, name: 'hello' }));
setCount((c) => c + 1);
```

## 常用 Hooks 速记

- **`useState`**：状态
- **`useEffect`**：副作用（请求、订阅、DOM 操作）
- **`useRef`**：持久化引用或 DOM 访问
- **`useMemo` / `useCallback`**：缓存计算结果或函数，减少无意义重渲染

### `useEffect` 依赖规则

- 不写依赖：每次渲染都执行
- `[]`：仅首次挂载执行
- `[a, b]`：依赖变化才执行

## 常见易错点

- `key` 不稳定导致列表错乱
- 直接修改 state 导致视图不更新
- `useEffect` 依赖缺失导致数据不同步

## 小结

1. JSX 更严格，但更清晰。
2. 组件负责拆分 UI 与复用逻辑。
3. 数据流默认单向：父传子，子通过回调影响父。
