import { hello } from '../utils.js'

describe('utils', () => {
  describe('hello', () => {
    test('should return message', () => {
      expect(hello()).toBe('Hello')
    })
  })
})
