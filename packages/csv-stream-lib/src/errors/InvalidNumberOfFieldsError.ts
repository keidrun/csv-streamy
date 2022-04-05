import { CsvTransformError } from './CsvTransformError.js'

export class InvalidNumberOfFieldsError extends CsvTransformError {
  constructor(numberOfHeaders: number, numberOfFields: number) {
    super(`The number of fields must be ${numberOfHeaders} but ${numberOfFields}.`)
  }
}
