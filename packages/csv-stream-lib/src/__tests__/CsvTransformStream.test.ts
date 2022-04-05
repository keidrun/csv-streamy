import { CsvTransformStream } from '../CsvTransformStream.js'
import { InvalidNumberOfFieldsError } from '../errors/InvalidNumberOfFieldsError.js'
import { readTestData } from './fixtures/index'
import { InvalidCsvFormatError } from '../errors/InvalidCsvFormatError'

describe('CsvTransformStream', () => {
  describe('asParser', () => {
    describe('options', () => {
      test('should return CsvTransformStream', () => {
        const parser = CsvTransformStream.asParser()

        expect(parser).toBeInstanceOf(CsvTransformStream)
        expect(parser.hasHeaders).toBe(false)
        expect(parser.hasDoubleQuotes).toBe(false)
      })
      test('should return CsvTransformStream when options are passed', () => {
        const parser = CsvTransformStream.asParser({ hasHeaders: true, hasDoubleQuotes: true })

        expect(parser).toBeInstanceOf(CsvTransformStream)
        expect(parser.hasHeaders).toBe(true)
        expect(parser.hasDoubleQuotes).toBe(true)
      })
    })
    describe('data that has no headers and no double-quotes', () => {
      test('should parse csv data', (done) => {
        const reader = readTestData('1_001')
        const parser = CsvTransformStream.asParser()

        const result = []
        reader
          .pipe(parser)
          .on('data', (data) => {
            result.push(data)
          })
          .on('close', () => {
            expect(result.length).toBe(3)
            done()
          })
      })
      test('should parse csv data that has first new line', (done) => {
        const reader = readTestData('1_002')
        const parser = CsvTransformStream.asParser()

        const result = []
        reader
          .pipe(parser)
          .on('data', (data) => {
            result.push(data)
          })
          .on('close', () => {
            expect(result.length).toBe(3)
            done()
          })
      })
      test('should parse csv data that has final new line', (done) => {
        const reader = readTestData('1_003')
        const parser = CsvTransformStream.asParser()

        const result = []
        reader
          .pipe(parser)
          .on('data', (data) => {
            result.push(data)
          })
          .on('close', () => {
            expect(result.length).toBe(3)
            done()
          })
      })
    })
    describe('data that has headers and no double-quotes', () => {
      test('should parse csv data', (done) => {
        const reader = readTestData('2_001')
        const parser = CsvTransformStream.asParser({ hasHeaders: true })

        const result = []
        reader
          .pipe(parser)
          .on('data', (data) => {
            result.push(data)
          })
          .on('close', () => {
            expect(result.length).toBe(3)
            done()
          })
      })
      test('should parse csv data that has first new line', (done) => {
        const reader = readTestData('2_002')
        const parser = CsvTransformStream.asParser({ hasHeaders: true })

        const result = []
        reader
          .pipe(parser)
          .on('data', (data) => {
            result.push(data)
          })
          .on('close', () => {
            expect(result.length).toBe(3)
            done()
          })
      })
      test('should parse csv data that has final new line', (done) => {
        const reader = readTestData('2_003')
        const parser = CsvTransformStream.asParser({ hasHeaders: true })

        const result = []
        reader
          .pipe(parser)
          .on('data', (data) => {
            result.push(data)
          })
          .on('close', () => {
            expect(result.length).toBe(3)
            done()
          })
      })
      test('should throw error when the number of headers is less than the number of fileds', (done) => {
        const reader = readTestData('2_101')
        const parser = CsvTransformStream.asParser({ hasHeaders: true })

        reader
          .pipe(parser)
          .on('error', (error) => {
            expect(error).toBeInstanceOf(InvalidNumberOfFieldsError)
          })
          .on('close', () => {
            done()
          })
      })
      test('should throw error when the number of fields is less than the number of headers', (done) => {
        const reader = readTestData('2_102')
        const parser = CsvTransformStream.asParser({ hasHeaders: true })

        reader
          .pipe(parser)
          .on('error', (error) => {
            expect(error).toBeInstanceOf(InvalidNumberOfFieldsError)
          })
          .on('close', () => {
            done()
          })
      })
    })
    describe('data that has no headers and double-quotes', () => {
      test('should parse csv data', (done) => {
        const reader = readTestData('3_001')
        const parser = CsvTransformStream.asParser({ hasDoubleQuotes: true })

        const result = []
        reader
          .pipe(parser)
          .on('data', (data) => {
            result.push(data)
          })
          .on('close', () => {
            expect(result.length).toBe(3)
            done()
          })
      })
      test('should parse csv data whose fields has new line', (done) => {
        const reader = readTestData('3_002')
        const parser = CsvTransformStream.asParser({ hasDoubleQuotes: true })

        const result = []
        reader
          .pipe(parser)
          .on('data', (data) => {
            result.push(data)
          })
          .on('close', () => {
            expect(result.length).toBe(3)
            done()
          })
      })
    })
    describe('data that has headers and double-quotes', () => {
      test('should parse csv data', (done) => {
        const reader = readTestData('4_001')
        const parser = CsvTransformStream.asParser({ hasHeaders: true, hasDoubleQuotes: true })

        const result = []
        reader
          .pipe(parser)
          .on('data', (data) => {
            result.push(data)
          })
          .on('close', () => {
            expect(result.length).toBe(3)
            done()
          })
      })
      test('should parse csv data whose headers has new line', (done) => {
        const reader = readTestData('4_002')
        const parser = CsvTransformStream.asParser({ hasHeaders: true, hasDoubleQuotes: true })

        const result = []
        reader
          .pipe(parser)
          .on('data', (data) => {
            result.push(data)
          })
          .on('close', () => {
            expect(result.length).toBe(3)
            done()
          })
      })
      test('should parse csv data whose fields has new line', (done) => {
        const reader = readTestData('4_003')
        const parser = CsvTransformStream.asParser({ hasHeaders: true, hasDoubleQuotes: true })

        const result = []
        reader
          .pipe(parser)
          .on('data', (data) => {
            result.push(data)
          })
          .on('close', () => {
            expect(result.length).toBe(3)
            done()
          })
      })
      test('should throw error when first character is not double-quote', (done) => {
        const reader = readTestData('4_101')
        const parser = CsvTransformStream.asParser({ hasHeaders: true, hasDoubleQuotes: true })

        reader
          .pipe(parser)
          .on('error', (error) => {
            expect(error).toBeInstanceOf(InvalidCsvFormatError)
          })
          .on('close', () => {
            done()
          })
      })
      test('should throw error when final character is not double-quote', (done) => {
        const reader = readTestData('4_102')
        const parser = CsvTransformStream.asParser({ hasHeaders: true, hasDoubleQuotes: true })

        reader
          .pipe(parser)
          .on('error', (error) => {
            expect(error).toBeInstanceOf(InvalidCsvFormatError)
          })
          .on('close', () => {
            done()
          })
      })
    })
  })
  describe('asConverter', () => {
    describe('options', () => {
      test('should return CsvTransformStream', () => {
        const converter = CsvTransformStream.asConverter()

        expect(converter).toBeInstanceOf(CsvTransformStream)
        expect(converter.hasHeaders).toBe(false)
        expect(converter.hasDoubleQuotes).toBe(false)
      })
      test('should return CsvTransformStream when options are passed', () => {
        const converter = CsvTransformStream.asConverter({ hasHeaders: true, hasDoubleQuotes: true })

        expect(converter).toBeInstanceOf(CsvTransformStream)
        expect(converter.hasHeaders).toBe(true)
        expect(converter.hasDoubleQuotes).toBe(true)
      })
    })
  })
})
