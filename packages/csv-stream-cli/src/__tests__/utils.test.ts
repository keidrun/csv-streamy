import { toInt } from '../utils.js'

describe('utils', () => {
  describe('toInt', () => {
    test('should return a number when a size is integer', () => {
      expect(toInt('39')).toBe(39)
    })
    test('should return a ceiled number when a size is float', () => {
      expect(toInt('39.1')).toBe(40)
    })
    test('should return a NaN when a size is string', () => {
      expect(toInt('stuff1234')).toBe(NaN)
    })
    test('should return a NaN when a size is string with unit', () => {
      expect(toInt('stuff1234K')).toBe(NaN)
    })
    test('should return  a number * K unit', () => {
      expect(toInt('3K')).toBe(3 * 1024)
    })
    test('should return  a number * M unit', () => {
      expect(toInt('5M')).toBe(5 * 1024 * 1024)
    })
    test('should return  a number * G unit', () => {
      expect(toInt('12G')).toBe(12 * 1024 * 1024 * 1024)
    })
    test('should return  a number * T unit', () => {
      expect(toInt('1T')).toBe(1 * 1024 * 1024 * 1024 * 1024)
    })
    test('should return  a number * P unit', () => {
      expect(toInt('20P')).toBe(20 * 1024 * 1024 * 1024 * 1024 * 1024)
    })
    test('should return  a number * E unit', () => {
      expect(toInt('7E')).toBe(7 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024)
    })
    test('should return  a number * Z unit', () => {
      expect(toInt('99Z')).toBe(99 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024)
    })
    test('should return  a number * Y unit', () => {
      expect(toInt('8Y')).toBe(8 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024)
    })
  })
})
