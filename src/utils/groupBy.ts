export function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K
): Record<string, T[]> {
  const result: Record<string, T[]> = {}
  for (const item of items) {
    const key = String(keyFn(item))
    if (!result[key]) result[key] = []
    result[key].push(item)
  }
  return result
}
