import { splitByNewline, splitByComma } from '../utils.js'

describe('utils', () => {
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
  describe('splitByComma', () => {
    test('should split line by comma', () => {
      const line = `item[1][1],item[1][2],item[1][3],item[1][4],item[1][5]`

      const items = splitByComma(line)

      expect(items.length).toBe(5)
    })
    test('should split line that has first comma by comma', () => {
      const line = `,item[1][1],item[1][2],item[1][3],item[1][4],item[1][5]`

      const items = splitByComma(line)

      expect(items.length).toBe(6)
    })
    test('should split line that has last comma by comma', () => {
      const line = `item[1][1],item[1][2],item[1][3],item[1][4],item[1][5],`

      const items = splitByComma(line)

      expect(items.length).toBe(6)
    })
    test('should split double-quoted line by comma', () => {
      const line = `"item[1][1]","item[1][2]","item[1][3]","item[1][4]","item[1][5]"`

      const items = splitByComma(line, { hasDoubleQuotes: true })

      expect(items.length).toBe(5)
    })
    test('should split double-quoted line that has first comma by comma', () => {
      const line = `,"item[1][1]","item[1][2]","item[1][3]","item[1][4]","item[1][5]"`

      expect(() => splitByComma(line, { hasDoubleQuotes: true })).toThrow()
    })
    test('should split double-quoted line that has last comma by comma', () => {
      const line = `"item[1][1]","item[1][2]","item[1][3]","item[1][4]","item[1][5]",`

      expect(() => splitByComma(line, { hasDoubleQuotes: true })).toThrow()
    })
    test('should split double-quoted that has comma inside it line by comma', () => {
      const line = `",item[1][1]","item,[1][2]","item[1],[3]","item[1][4],","item[1][5],"`

      const items = splitByComma(line, { hasDoubleQuotes: true })

      expect(items.length).toBe(5)
    })
    test('should split double-quoted that has double-quote as escape character line by comma', () => {
      const line = `"""item[1][1]","item""[1][2]","item[1]""[3]","item[1][4]""","item[1][5]"""`

      const items = splitByComma(line, { hasDoubleQuotes: true })

      expect(items.length).toBe(5)
    })
    test('should split double-quoted that has slash as escape character line by comma', () => {
      const line = `"\\"item[1][1]","item\\"[1][2]","item[1]\\"[3]","item[1][4]\\"","item[1][5]\\""`

      const items = splitByComma(line, { hasDoubleQuotes: true })

      expect(items.length).toBe(5)
    })
  })
})
