/** Typographer's quotes for display text: "x" → “x”, it's → it’s */
export function smartQuotes(text: string): string {
  return text
    .replace(/(^|[\s([{-])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/(^|[\s([{-])'/g, "$1‘")
    .replace(/'/g, "’");
}
