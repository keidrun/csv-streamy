import { filename, dirname, splitByNewline } from '../utils.js'

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
  describe('splitByNewline', () => {
    test('should split data by new line', () => {
      const data = `header[1],header[2],header[3],header[4],header[5]
item[1][1],item[1][2],item[1][3],item[1][4],item[1][5]
item[2][1],item[2][2],item[2][3],item[2][4],item[2][5]
item[3][1],item[3][2],item[3][3],item[3][4],item[3][5]`

      const lines = splitByNewline(data)

      expect(lines.length).toBe(4)
    })
    test('should split data that has final new line by new line', () => {
      const data = `header[1],header[2],header[3],header[4],header[5]
item[1][1],item[1][2],item[1][3],item[1][4],item[1][5]
item[2][1],item[2][2],item[2][3],item[2][4],item[2][5]
item[3][1],item[3][2],item[3][3],item[3][4],item[3][5]
`

      const lines = splitByNewline(data)

      expect(lines.length).toBe(5)
    })
    test('should split data that has first new line by new line', () => {
      const data = `
header[1],header[2],header[3],header[4],header[5]
item[1][1],item[1][2],item[1][3],item[1][4],item[1][5]
item[2][1],item[2][2],item[2][3],item[2][4],item[2][5]
item[3][1],item[3][2],item[3][3],item[3][4],item[3][5]`

      const lines = splitByNewline(data)

      expect(lines.length).toBe(4)
    })
    test('should split double-quoted data by new line', () => {
      const data = `"header[1]","header[2]","header[3]","header[4]","header[5]"
"item[1][1]","item[1][2]","item[1][3]","item[1][4]","item[1][5]"
"item[2][1]","item[2][2]","item[2][3]","item[2][4]","item[2][5]"
"item[3][1]","item[3][2]","item[3][3]","item[3][4]","item[3][5]"`

      const lines = splitByNewline(data, { hasDoubleQuotes: true })

      expect(lines.length).toBe(4)
    })
    test('should split double-quoted data that has final new line by new line', () => {
      const data = `"header[1]","header[2]","header[3]","header[4]","header[5]"
"item[1][1]","item[1][2]","item[1][3]","item[1][4]","item[1][5]"
"item[2][1]","item[2][2]","item[2][3]","item[2][4]","item[2][5]"
"item[3][1]","item[3][2]","item[3][3]","item[3][4]","item[3][5]"
`

      const lines = splitByNewline(data, { hasDoubleQuotes: true })

      expect(lines.length).toBe(5)
    })
    test('should split double-quoted data that has first new line by new line', () => {
      const data = `
"header[1]","header[2]","header[3]","header[4]","header[5]"
"item[1][1]","item[1][2]","item[1][3]","item[1][4]","item[1][5]"
"item[2][1]","item[2][2]","item[2][3]","item[2][4]","item[2][5]"
"item[3][1]","item[3][2]","item[3][3]","item[3][4]","item[3][5]"`

      const lines = splitByNewline(data, { hasDoubleQuotes: true })

      expect(lines.length).toBe(4)
    })
    test('should split double-quoted data that has escape characters new line by new line', () => {
      const data = `"header[1]","header[2]","header[3]","header[4]","header[5]"
",item[1][1]","item,[1][2]","item[1],[3]","item[1][4],","item[1][5],"
"""item[2][1]","item""[2][2]","item[2]""[3]","item[2][4]""","item[2][5]"""
"\\"item[3][1]","item\\"[3][2]","item[3]\\"[3]","item[3][4]\\"","item[3][5]"
"item[4][1]","item[4][2]","item[4][3]","item[4][4]","item[4][5]"`

      const lines = splitByNewline(data, { hasDoubleQuotes: true })

      expect(lines.length).toBe(5)
    })
  })
})
