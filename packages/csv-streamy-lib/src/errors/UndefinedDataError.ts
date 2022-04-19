import { CsvTransformError } from './CsvTransformError.js'

export class UndefinedDataError extends CsvTransformError {
  constructor(propertyName: string) {
    super(`${propertyName} is not defined.`)
  }
}
