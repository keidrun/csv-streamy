import { filename, dirname } from '../utils.js'

describe('utils', () => {
  describe('filename', () => {
    test('should return a file path', () => {
      expect(filename({ url: 'file:///dir/file.txt' })).toBe('/dir/file.txt')
    })
  })
  describe('dirname', () => {
    test('should return a directory path', () => {
      expect(dirname({ url: 'file:///dir/file.txt' })).toBe('/dir')
    })
  })
})
