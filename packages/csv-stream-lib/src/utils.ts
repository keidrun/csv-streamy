import path from 'path'
import { fileURLToPath } from 'url'

export function filename(importMeta: { url: string }): string {
  return fileURLToPath(importMeta.url)
}

export function dirname(importMeta: { url: string }): string {
  return path.dirname(filename(importMeta))
}

const escapeCharsInCsv = ['"', '\\']

export function splitByNewline(data: string, options?: { hasDoubleQuotes: boolean }): string[] {
  const hasDoubleQuotes = options?.hasDoubleQuotes || false

  if (!hasDoubleQuotes) return data.trimStart().split('\n')

  const hasEndOfLine = (line: string): boolean => {
    if (line.length <= 3) return false

    if (!escapeCharsInCsv.includes(line.slice(-3, -2)) && line.slice(-2, -1) === '"' && line.slice(-1) === '\n') {
      return true
    } else if (line.slice(-2, -1) === '"' && line.slice(-1) === '\n') {
      const reversed = line.slice(0, -2).split('').reverse().join('')
      let escapeCount = 0
      for (const char of reversed) {
        if (escapeCharsInCsv.includes(char)) escapeCount++
        break
      }
      if (escapeCount % 2 !== 0) {
        return true
      }
    }

    return false
  }

  const lines = []
  let line = ''
  for (const char of data.trimStart()) {
    if (line.length <= 3) {
      line += char
      continue
    }

    if (hasEndOfLine(line)) {
      lines.push(line.slice(0, -1))
      line = ''
    }

    line += char
  }

  // check last characters because `for...of` statement truncates the final new line character
  if (hasEndOfLine(line)) {
    lines.push(line.slice(0, -1))
    line = ''
  }

  lines.push(line)

  return lines
}
