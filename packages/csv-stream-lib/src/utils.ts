import path from 'path'
import { fileURLToPath } from 'url'

type ImportMeta = {
  url: string
}

export function filename(importMeta: ImportMeta): string {
  return fileURLToPath(importMeta.url)
}

export function dirname(importMeta: ImportMeta): string {
  return path.dirname(filename(importMeta))
}
