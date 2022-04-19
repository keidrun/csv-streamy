import type { Readable } from 'stream'
import { createReadStream } from 'fs'
import { resolve } from 'path'
import { dirname } from 'dirfilename'

export function readTestData(
  baseName: string,
  options?: { encoding?: BufferEncoding; highWaterMark?: number },
): Readable {
  const encoding = options?.encoding || 'utf-8'
  const highWaterMark = options?.highWaterMark || 1 * 1024

  return createReadStream(resolve(dirname(import.meta), `${baseName}.csv`), {
    encoding: encoding,
    highWaterMark: highWaterMark,
  })
}
