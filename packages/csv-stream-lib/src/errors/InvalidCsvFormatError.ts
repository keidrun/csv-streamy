import { CsvTransformError } from './CsvTransformError.js'

export class InvalidCsvFormatError extends CsvTransformError {
  constructor(message: string) {
    super(message)
  }
}
