import path from 'path'
import { fileURLToPath } from 'url'

export function filename(importMeta: { url: string }): string {
  return fileURLToPath(importMeta.url)
}

export function dirname(importMeta: { url: string }): string {
  return path.dirname(filename(importMeta))
}
