import { Transform, TransformCallback, TransformOptions } from 'stream'
import { splitByNewline, splitByComma } from './utils.js'
import type { CsvTransformError } from './errors/CsvTransformError.js'
import { InvalidNumberOfFieldsError } from './errors/InvalidNumberOfFieldsError.js'
import { UndefinedDataError } from './errors/UndefinedDataError.js'

export type ParserOptions = {
  hasHeaders?: boolean
  hasDoubleQuotes?: boolean
}

export type ConverterOptions = {
  hasHeaders?: boolean
  hasDoubleQuotes?: boolean
}

export type CsvRowData = {
  data: { [key: string]: string }
}

export enum Event {
  Current = 'current',
  Total = 'total',
}

export interface CsvTransformOptions<T> extends TransformOptions {
  hasHeaders?: boolean
  hasDoubleQuotes?: boolean

  construct?(this: CsvTransformStream<T>, callback: (error?: Error | null) => void): void
  read?(this: CsvTransformStream<T>, size: number): void
  write?(
    this: CsvTransformStream<T>,
    chunk: T,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void
  writev?(
    this: CsvTransformStream<T>,
    chunks: Array<{
      chunk: T
      encoding: BufferEncoding
    }>,
    callback: (error?: Error | null) => void,
  ): void
  final?(this: CsvTransformStream<T>, callback: (error?: Error | null) => void): void
  destroy?(this: CsvTransformStream<T>, error: Error | null, callback: (error: Error | null) => void): void
  transform?(this: CsvTransformStream<T>, chunk: T, encoding: BufferEncoding, callback: TransformCallback): void
  flush?(this: CsvTransformStream<T>, callback: TransformCallback): void
}

export class CsvTransformStream<T> extends Transform {
  static asParser(
    { hasHeaders = false, hasDoubleQuotes = false }: ParserOptions = {
      hasHeaders: false,
      hasDoubleQuotes: false,
    },
  ): CsvTransformStream<Buffer> {
    return new CsvTransformStream<Buffer>({
      hasHeaders: hasHeaders,
      hasDoubleQuotes: hasDoubleQuotes,
      transform(chunk: Buffer, _: BufferEncoding, callback: TransformCallback): void {
        const chunked = Buffer.concat([this.buffer, Buffer.from(chunk)])

        try {
          const lines = splitByNewline(chunked.toString(), { hasDoubleQuotes: this.hasDoubleQuotes })

          for (const [index, line] of lines.entries()) {
            if (line === '') {
              this.buffer = Buffer.alloc(0)
              continue
            }

            if (index === lines.length - 1) {
              this.buffer = Buffer.from(line)
              break
            }

            if (this.hasHeaders && this.headers.length === 0) {
              const headerFields = splitByComma(line, { hasDoubleQuotes: this.hasDoubleQuotes })
              for (const header of headerFields) {
                this.headers.push(header)
              }
              continue
            }

            this._mapToFields(line)
          }

          callback()
        } catch (error) {
          callback(error as CsvTransformError)
        }
      },
      final(callback: TransformCallback): void {
        const lastLine = this.buffer.toString()
        this.buffer = Buffer.alloc(0)

        if (lastLine === '') {
          this._emitTotalEvent()
          callback()
          return
        }

        try {
          this._mapToFields(lastLine)
          this._emitTotalEvent()
          callback()
        } catch (error) {
          callback(error as CsvTransformError)
        }
      },
    })
  }

  static asConverter(
    { hasHeaders = false, hasDoubleQuotes = false }: ConverterOptions = { hasHeaders: false, hasDoubleQuotes: false },
  ): CsvTransformStream<CsvRowData> {
    return new CsvTransformStream<CsvRowData>({
      hasHeaders: hasHeaders,
      hasDoubleQuotes: hasDoubleQuotes,
      transform(chunk: CsvRowData, _: BufferEncoding, callback: TransformCallback): void {
        try {
          this._mapToLine(chunk)
          callback()
        } catch (error) {
          callback(error as CsvTransformError)
        }
      },
    })
  }

  hasHeaders = false
  hasDoubleQuotes = false

  buffer = Buffer.alloc(0)
  headers: string[] = []
  numberOfRows = 0
  byteSize = 0

  constructor(options?: CsvTransformOptions<T>) {
    super({ ...options, objectMode: true })
    this.hasHeaders = options?.hasHeaders || false
    this.hasDoubleQuotes = options?.hasDoubleQuotes || false
  }

  private _emitCurrentEvent(data: CsvRowData, rawData: string) {
    this.numberOfRows++
    this.byteSize += Buffer.byteLength(rawData)
    const total = {
      count: this.numberOfRows,
      amount: this.byteSize,
    }
    this.emit(Event.Current, data, total)
  }

  private _emitTotalEvent() {
    const total = {
      count: this.numberOfRows,
      amount: this.byteSize,
    }
    this.emit(Event.Total, total)
  }

  private _mapToFields(line: string): void {
    const fields = splitByComma(line, { hasDoubleQuotes: this.hasDoubleQuotes })
    const { data }: CsvRowData = { data: {} }
    if (this.hasHeaders) {
      if (this.headers.length !== fields.length) {
        throw new InvalidNumberOfFieldsError(this.headers.length, fields.length)
      }

      for (const [index, field] of fields.entries()) {
        data[this.headers[index] as string] = field
      }
      this.push({ data })

      this._emitCurrentEvent({ data }, line)
    } else {
      for (const [index, field] of fields.entries()) {
        data[`${index + 1}`] = field
      }
      this.push({ data })

      this._emitCurrentEvent({ data }, line)
    }
  }

  private _mapToLine({ data }: CsvRowData): void {
    if (!data) {
      throw new UndefinedDataError('data')
    }

    if (this.hasHeaders && this.headers.length === 0) {
      for (const key of Object.keys(data)) {
        this.headers.push(key)
      }
      const headersline = this.hasDoubleQuotes ? `"${this.headers.join('","')}"\n` : `${this.headers.join(',')}\n`
      this.push(Buffer.from(headersline))
    }

    const fields: string[] = []
    for (const key of Object.keys(data)) {
      fields.push(data[key] as string)
    }
    if (this.hasHeaders && this.headers.length !== fields.length) {
      throw new InvalidNumberOfFieldsError(this.headers.length, fields.length)
    }
    const line = this.hasDoubleQuotes ? `"${fields.join('","')}"\n` : `${fields.join(',')}\n`
    this.push(Buffer.from(line))
  }
}
