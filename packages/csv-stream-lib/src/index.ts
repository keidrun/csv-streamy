import { CsvTransformStream, ParserOptions, ConverterOptions, CsvRowData } from './CsvTransformStream.js'
import { CsvTransformError } from './errors/CsvTransformError.js'
import { InvalidCsvFormatError } from './errors/InvalidCsvFormatError.js'
import { InvalidNumberOfFieldsError } from './errors/InvalidNumberOfFieldsError.js'

export function createCsvParser(options?: ParserOptions): CsvTransformStream<Buffer> {
  return CsvTransformStream.asParser(options)
}

export function createCsvConverter(optins?: ConverterOptions): CsvTransformStream<CsvRowData> {
  return CsvTransformStream.asConverter(optins)
}

export {
  CsvTransformStream,
  ParserOptions,
  ConverterOptions,
  CsvTransformError,
  InvalidCsvFormatError,
  InvalidNumberOfFieldsError,
}
