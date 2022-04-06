import { CsvTransformStream, ParserOptions, ConverterOptions } from './CsvTransformStream.js'
import { CsvTransformError } from './errors/CsvTransformError.js'
import { InvalidCsvFormatError } from './errors/InvalidCsvFormatError.js'
import { InvalidNumberOfFieldsError } from './errors/InvalidNumberOfFieldsError.js'
import { dirname, filename } from './utils.js'

export function createCsvParser(options?: ParserOptions): CsvTransformStream<Buffer> {
  return CsvTransformStream.asParser(options)
}

export function createCsvConverter(optins?: ConverterOptions): CsvTransformStream<{ [key: string]: string }> {
  return CsvTransformStream.asConverter(optins)
}

export {
  CsvTransformStream,
  ParserOptions,
  ConverterOptions,
  CsvTransformError,
  InvalidCsvFormatError,
  InvalidNumberOfFieldsError,
  dirname,
  filename,
}
