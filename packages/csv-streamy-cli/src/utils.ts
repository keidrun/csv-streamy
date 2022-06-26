import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

type PackageJson = {
  version: string
}

// Workaround to load JSON because JSON modules is experimental in Node.js v16.
// https://nodejs.org/docs/latest-v16.x/api/esm.html#json-modules
const packageJson = require('../package.json') as PackageJson

const SIZE_UNIT: {
  [key: string]: number
} = {
  K: 1024,
  M: 1024 * 1024,
  G: 1024 * 1024 * 1024,
  T: 1024 * 1024 * 1024 * 1024,
  P: 1024 * 1024 * 1024 * 1024 * 1024,
  E: 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
  Z: 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
  Y: 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
}

export function toInt(size?: string): number {
  if (!size) return NaN

  const numStr = size.slice(0, -1)
  const num = !Number.isNaN(Number(numStr)) ? Math.ceil(Number(numStr)) : NaN
  const unitKey = size.slice(-1)

  if (!Object.keys(SIZE_UNIT).includes(unitKey)) {
    if (!Number.isNaN(Number(size))) {
      return Math.ceil(Number(size))
    }
    return NaN
  }

  return num * Number(SIZE_UNIT[unitKey])
}

export function version(): string {
  return packageJson.version
}
