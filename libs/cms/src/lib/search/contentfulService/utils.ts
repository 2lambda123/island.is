import type { Locale } from 'locale'

// Contentful locale does not always reflect the api locale so we need this map
export const contentfulLocaleMap = {
  is: 'is-IS',
  en: 'en',
}

export function removeLocaleKeysFromEntry(
  node: object,
  locale: Locale,
  skippedKey?: string,
  visited = new Set<object>(),
) {
  if (!node || typeof node !== 'object' || visited.has(node)) return node

  visited.add(node)

  for (const key in node) {
    const value = node[key as keyof typeof node]

    if (skippedKey && key === skippedKey) continue

    if (typeof value === 'object') {
      ;(node[key as keyof typeof node] as
        | object
        | null) = removeLocaleKeysFromEntry(value, locale, skippedKey, visited)
    }
    if (key === contentfulLocaleMap[locale]) {
      return value
    }
  }

  // Make sure we null out the other locale values
  for (const key in node) {
    if (Object.values(contentfulLocaleMap).includes(key)) {
      return null
    }
  }

  return node
}