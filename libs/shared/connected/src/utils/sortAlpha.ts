/**
 * NOTE:
 *  The contents of this file are the same as in the file apps/web/utils/sortAlpha.ts
 *  We cannot import from that file, as it will create circular dependency.
 *  Therefor, at least for now, we copy this code here. Ideally, this code would be
 *  moved into a dedicated utils library.
 */

type Item = {
  [key: string]: unknown
}

const order =
  '0123456789aAáÁbBcCdDeEéÉfFgGhHiIíÍjJkKlLmMnNoOóÓpPqQrRsStTuUúÚvVwWxXyYýÝzZþÞæÆöÖ'

const charOrder = (a: string) => {
  const ix = order.indexOf(a)
  return ix === -1 ? a.charCodeAt(0) + order.length : ix
}

const isStringOrNumber = (key: unknown) =>
  ['number', 'string'].includes(typeof key)

export const sortAlpha = <T extends Item>(key = 'title') => (a: T, b: T) => {
  if (
    !a[key] ||
    !b[key] ||
    !isStringOrNumber(a[key]) ||
    !isStringOrNumber(b[key])
  ) {
    return 0
  }

  const s1 = String(a[key])
  const s2 = String(b[key])

  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    const iA = charOrder(s1[i])
    const iB = charOrder(s2[i])

    if (iA !== iB) {
      return iA - iB
    }
  }

  return s1.length - s2.length
}
