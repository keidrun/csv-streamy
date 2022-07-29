import { describe, test, expect } from 'vitest'
import { PassThrough } from 'stream'

import { readTestData } from './fixtures/index.js'
import { CsvTransformStream, CsvRowData } from '../CsvTransformStream.js'
import { InvalidNumberOfFieldsError } from '../errors/InvalidNumberOfFieldsError.js'
import { InvalidCsvFormatError } from '../errors/InvalidCsvFormatError.js'
import { UndefinedDataError } from '../errors/UndefinedDataError.js'

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
      test('should parse csv data', () =>
        new Promise((done, fail) => {
          const reader = readTestData('1_001')
          const parser = CsvTransformStream.asParser()

          const result: CsvRowData[] = []
          reader
            .pipe(parser)
            .on('data', (data: CsvRowData) => {
              result.push(data)
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(3)
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
        }))
      test('should parse csv data that has first new line', () =>
        new Promise((done, fail) => {
          const reader = readTestData('1_002')
          const parser = CsvTransformStream.asParser()

          const result: CsvRowData[] = []
          reader
            .pipe(parser)
            .on('data', (data: CsvRowData) => {
              result.push(data)
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(3)
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
        }))
      test('should parse csv data that has final new line', () =>
        new Promise((done, fail) => {
          const reader = readTestData('1_003')
          const parser = CsvTransformStream.asParser()

          const result: CsvRowData[] = []
          reader
            .pipe(parser)
            .on('data', (data: CsvRowData) => {
              result.push(data)
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(3)
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
        }))
    })
    describe('data that has headers and no double-quotes', () => {
      test('should parse csv data', () =>
        new Promise((done, fail) => {
          const reader = readTestData('2_001')
          const parser = CsvTransformStream.asParser({ hasHeaders: true })

          const result: CsvRowData[] = []
          reader
            .pipe(parser)
            .on('data', (data: CsvRowData) => {
              result.push(data)
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(3)
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
        }))
      test('should parse csv data that has first new line', () =>
        new Promise((done, fail) => {
          const reader = readTestData('2_002')
          const parser = CsvTransformStream.asParser({ hasHeaders: true })

          const result: CsvRowData[] = []
          reader
            .pipe(parser)
            .on('data', (data: CsvRowData) => {
              result.push(data)
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(3)
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
        }))
      test('should parse csv data that has final new line', () =>
        new Promise((done, fail) => {
          const reader = readTestData('2_003')
          const parser = CsvTransformStream.asParser({ hasHeaders: true })

          const result: CsvRowData[] = []
          reader
            .pipe(parser)
            .on('data', (data: CsvRowData) => {
              result.push(data)
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(3)
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
        }))
      test('should throw error when the number of headers is less than the number of fileds', () =>
        new Promise((done, fail) => {
          const reader = readTestData('2_101')
          const parser = CsvTransformStream.asParser({ hasHeaders: true })

          reader.pipe(parser).on('error', (error) => {
            try {
              expect(error).toBeInstanceOf(InvalidNumberOfFieldsError)
              return done(null)
            } catch (error) {
              return fail(error)
            }
          })
        }))
      test('should throw error when the number of fields is less than the number of headers', () =>
        new Promise((done) => {
          const reader = readTestData('2_102')
          const parser = CsvTransformStream.asParser({ hasHeaders: true })

          reader
            .pipe(parser)
            .on('error', (error) => {
              expect(error).toBeInstanceOf(InvalidNumberOfFieldsError)
            })
            .on('close', () => {
              return done(null)
            })
        }))
    })
    describe('data that has no headers and double-quotes', () => {
      test('should parse csv data', () =>
        new Promise((done, fail) => {
          const reader = readTestData('3_001')
          const parser = CsvTransformStream.asParser({ hasDoubleQuotes: true })

          const result: CsvRowData[] = []
          reader
            .pipe(parser)
            .on('data', (data: CsvRowData) => {
              result.push(data)
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(3)
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
        }))
      test('should parse csv data whose fields has new line', () =>
        new Promise((done, fail) => {
          const reader = readTestData('3_002')
          const parser = CsvTransformStream.asParser({ hasDoubleQuotes: true })

          const result: CsvRowData[] = []
          reader
            .pipe(parser)
            .on('data', (data: CsvRowData) => {
              result.push(data)
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(3)
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
        }))
    })
    describe('data that has headers and double-quotes', () => {
      test('should parse csv data', () =>
        new Promise((done, fail) => {
          const reader = readTestData('4_001')
          const parser = CsvTransformStream.asParser({ hasHeaders: true, hasDoubleQuotes: true })

          const result: CsvRowData[] = []
          reader
            .pipe(parser)
            .on('data', (data: CsvRowData) => {
              result.push(data)
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(3)
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
        }))
      test('should parse csv data whose headers has new line', () =>
        new Promise((done, fail) => {
          const reader = readTestData('4_002')
          const parser = CsvTransformStream.asParser({ hasHeaders: true, hasDoubleQuotes: true })

          const result: CsvRowData[] = []
          reader
            .pipe(parser)
            .on('data', (data: CsvRowData) => {
              result.push(data)
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(3)
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
        }))
      test('should parse csv data whose fields has new line', () =>
        new Promise((done, fail) => {
          const reader = readTestData('4_003')
          const parser = CsvTransformStream.asParser({ hasHeaders: true, hasDoubleQuotes: true })

          const result: CsvRowData[] = []
          reader
            .pipe(parser)
            .on('data', (data: CsvRowData) => {
              result.push(data)
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(3)
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
        }))
      test('should throw erro,failr when first character is not double-quote', () =>
        new Promise((done, fail) => {
          const reader = readTestData('4_101')
          const parser = CsvTransformStream.asParser({ hasHeaders: true, hasDoubleQuotes: true })

          reader.pipe(parser).on('error', (error) => {
            try {
              expect(error).toBeInstanceOf(InvalidCsvFormatError)
              return done(null)
            } catch (error) {
              return fail(error)
            }
          })
        }))
      test('should throw error when final character is not double-quote', () =>
        new Promise((done, fail) => {
          const reader = readTestData('4_102')
          const parser = CsvTransformStream.asParser({ hasHeaders: true, hasDoubleQuotes: true })

          reader.pipe(parser).on('error', (error) => {
            try {
              expect(error).toBeInstanceOf(InvalidCsvFormatError)
              return done(null)
            } catch (error) {
              return fail(error)
            }
          })
        }))
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
    describe('convert', () => {
      test('should throw error when the input data is undefined', () =>
        new Promise((done, fail) => {
          const converter = CsvTransformStream.asConverter()
          converter.on('error', (error) => {
            try {
              expect(error).toBeInstanceOf(UndefinedDataError)
              return done(null)
            } catch (error) {
              fail(error)
            }
          })
          converter.write({})
          converter.end()
        }))
      test('should throw error when the number of headers is less than the number of fileds', () =>
        new Promise((done, fail) => {
          const converter = CsvTransformStream.asConverter({ hasHeaders: true })
          converter.on('error', (error) => {
            try {
              expect(error).toBeInstanceOf(InvalidNumberOfFieldsError)
              return done(null)
            } catch (error) {
              return fail(error)
            }
          })
          converter.write({ data: { 'header[1]': 'item[1][1]', 'header[2]': 'item[1][2]', 'header[3]': 'item[1][3]' } })
          converter.write({ data: { 'header[1]': 'item[2][1]' } })
          converter.end()
        }))
      test('should pass csv format stream', () =>
        new Promise((done, fail) => {
          const converter = CsvTransformStream.asConverter()
          const spy = new PassThrough()
          const result: string[] = []
          converter
            .pipe(spy)
            .on('data', (data: Buffer) => {
              result.push(data.toString())
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(2)
                expect(result[0]).toBe('item[1][1],item[1][2],item[1][3]\n')
                expect(result[1]).toBe('item[2][1],item[2][2],item[2][3]\n')
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
          converter.write({ data: { 'header[1]': 'item[1][1]', 'header[2]': 'item[1][2]', 'header[3]': 'item[1][3]' } })
          converter.write({ data: { 'header[1]': 'item[2][1]', 'header[2]': 'item[2][2]', 'header[3]': 'item[2][3]' } })
          converter.end()
        }))
      test('should pass csv format stream when its option enable only hasHeaders flag', () =>
        new Promise((done, fail) => {
          const converter = CsvTransformStream.asConverter({ hasHeaders: true })
          const spy = new PassThrough()
          const result: string[] = []
          converter
            .pipe(spy)
            .on('data', (data: Buffer) => {
              result.push(data.toString())
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(3)
                expect(result[0]).toBe('header[1],header[2],header[3]\n')
                expect(result[1]).toBe('item[1][1],item[1][2],item[1][3]\n')
                expect(result[2]).toBe('item[2][1],item[2][2],item[2][3]\n')
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
          converter.write({ data: { 'header[1]': 'item[1][1]', 'header[2]': 'item[1][2]', 'header[3]': 'item[1][3]' } })
          converter.write({ data: { 'header[1]': 'item[2][1]', 'header[2]': 'item[2][2]', 'header[3]': 'item[2][3]' } })
          converter.end()
        }))
      test('should pass csv format stream when its option enable only hasDoubleQuotes flag', () =>
        new Promise((done, fail) => {
          const converter = CsvTransformStream.asConverter({ hasDoubleQuotes: true })
          const spy = new PassThrough()
          const result: string[] = []
          converter
            .pipe(spy)
            .on('data', (data: Buffer) => {
              result.push(data.toString())
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(2)
                expect(result[0]).toBe('"item[1][1]","item[1][2]","item[1][3]"\n')
                expect(result[1]).toBe('"item[2][1]","item[2][2]","item[2][3]"\n')
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
          converter.write({ data: { 'header[1]': 'item[1][1]', 'header[2]': 'item[1][2]', 'header[3]': 'item[1][3]' } })
          converter.write({ data: { 'header[1]': 'item[2][1]', 'header[2]': 'item[2][2]', 'header[3]': 'item[2][3]' } })
          converter.end()
        }))
      test('should pass csv format stream when its option enable hasHeaders flag and hasDoubleQuotes flag', () =>
        new Promise((done, fail) => {
          const converter = CsvTransformStream.asConverter({ hasHeaders: true, hasDoubleQuotes: true })
          const spy = new PassThrough()
          const result: string[] = []
          converter
            .pipe(spy)
            .on('data', (data: Buffer) => {
              result.push(data.toString())
            })
            .on('close', () => {
              try {
                expect(result.length).toBe(3)
                expect(result[0]).toBe('"header[1]","header[2]","header[3]"\n')
                expect(result[1]).toBe('"item[1][1]","item[1][2]","item[1][3]"\n')
                expect(result[2]).toBe('"item[2][1]","item[2][2]","item[2][3]"\n')
                return done(null)
              } catch (error) {
                return fail(error)
              }
            })
          converter.write({ data: { 'header[1]': 'item[1][1]', 'header[2]': 'item[1][2]', 'header[3]': 'item[1][3]' } })
          converter.write({ data: { 'header[1]': 'item[2][1]', 'header[2]': 'item[2][2]', 'header[3]': 'item[2][3]' } })
          converter.end()
        }))
    })
  })
})
