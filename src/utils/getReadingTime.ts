/**
 * Estimates reading time for blog post content.
 * Chinese: 300 chars/min, English: 200 words/min (mixed content supported).
 */
export function getReadingTime(content: string): number {
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) ?? []).length
  const nonChinese = content.replace(/[\u4e00-\u9fa5]/g, " ")
  const englishWords = nonChinese.split(/\s+/).filter(Boolean).length

  const minutes = chineseChars / 300 + englishWords / 200
  return Math.max(1, Math.round(minutes))
}
