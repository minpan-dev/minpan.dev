/**
 * Rehype plugin: adds loading="lazy" and decoding="async" to all <img> elements
 * in markdown/MDX content, enabling native browser lazy loading.
 */
export function rehypeImgLazy() {
  return function (tree) {
    visit(tree, "element", (node) => {
      if (node.tagName === "img") {
        node.properties = node.properties ?? {}
        node.properties.loading = "lazy"
        node.properties.decoding = "async"
      }
    })
  }
}

function visit(tree, type, visitor) {
  if (tree.type === type) visitor(tree)
  if (tree.children) {
    for (const child of tree.children) {
      visit(child, type, visitor)
    }
  }
}
