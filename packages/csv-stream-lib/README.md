# @csv-stream/lib

[![@csv-stream/lib](https://github.com/keidrun/csv-stream/actions/workflows/csv-stream-lib.yml/badge.svg)](https://github.com/keidrun/csv-stream/actions/workflows/csv-stream-lib.yml) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

CSV Stream library for Node.js.

## Install

```shell
npm i @csv-stream/lib
```

## Usage

### Parsing

You can parse your csv file, which can contain headers and enclose fields in double-quotes, to handy objects.

```typescript
import * as fs from 'fs'
import * as path from 'path'
import { createCsvParser } from '@csv-stream/lib'

const reader = fs.createReadStream(path.resolve(__dirname, 'your.csv'))
const parser = createCsvParser({ hasHeaders: true, hasDoubleQuotes: true })

reader
  .pipe(parser)
  .on('error', (error) => console.log(error))
  .on('data', (row) => console.log(row))
  .on('end', () => console.log('Done!'))
```

- Input

```csv:your.csv
"header[1]","header[2]","header[3]"
"item[1][1]","item[1][2]","item[1][3]"
"item[3][1]","item[3][2]","item[3][3]"
```

- Output

```shell
{
  'header[1]': 'item[1][1]',
  'header[2]': 'item[1][2]',
  'header[3]': 'item[1][3]'
}
{
  'header[1]': 'item[3][1]',
  'header[2]': 'item[3][2]',
  'header[3]': 'item[3][3]'
}
End
```

This parser provides 2 extra events that are `current` event and `total` event.

```typescript
reader
  .pipe(parser)
  .on('error', (error) => console.log(error))
  .on('current', (row, currentTotal: { count: number; amount: number }) => {
    console.log(row)
    console.log(`Progress => row count: ${currentTotal.count}, data amount: ${currentTotal.amount} [bytes].`)
  })
  .on('total', (total: { count: number; amount: number }) =>
    console.log(`End => row count: ${total.count}, data amount: ${total.amount} [bytes].`),
  )
```

- Output

```shell
{
  'header[1]': 'item[1][1]',
  'header[2]': 'item[1][2]',
  'header[3]': 'item[1][3]'
}
Progress => row count: 1, data amount: 38 [bytes].
{
  'header[1]': 'item[3][1]',
  'header[2]': 'item[3][2]',
  'header[3]': 'item[3][3]'
}
Progress => row count: 2, data amount: 76 [bytes].
End => row count: 2, data amount: 76 [bytes].
```

### Converting

You can convert your handy objects to csv format strings, which can contain headers and enclose fields in double-quotes, then create buffer stream.

```typescript
import { createCsvConverter } from '@csv-stream/lib'

const converter = createCsvConverter({ hasHeaders: true, hasDoubleQuotes: true })

converter.pipe(process.stdout).on('end', () => process.exit())

converter.write({ 'header[1]': 'item[1][1]', 'header[2]': 'item[1][2]', 'header[3]': 'item[1][3]' })
converter.write({ 'header[1]': 'item[2][1]', 'header[2]': 'item[2][2]', 'header[3]': 'item[2][3]' })
converter.write({ 'header[1]': 'item[3][1]', 'header[2]': 'item[3][2]', 'header[3]': 'item[3][3]' })
converter.end()
```

- Output

```shell
"header[1]","header[2]","header[3]"
"item[1][1]","item[1][2]","item[1][3]"
"item[2][1]","item[2][2]","item[2][3]"
"item[3][1]","item[3][2]","item[3][3]"

```

Of course, you can export them to a file.

```typescript
import * as fs from 'fs'
import * as path from 'path'
import { createCsvConverter } from '@csv-stream/lib'

const converter = createCsvConverter({ hasHeaders: true, hasDoubleQuotes: true })
const writer = fs.createWriteStream(path.resolve(__dirname, 'output.csv'))

converter.pipe(writer).on('end', () => writer.end())

converter.write({ 'header[1]': 'item[1][1]', 'header[2]': 'item[1][2]', 'header[3]': 'item[1][3]' })
converter.write({ 'header[1]': 'item[2][1]', 'header[2]': 'item[2][2]', 'header[3]': 'item[2][3]' })
converter.write({ 'header[1]': 'item[3][1]', 'header[2]': 'item[3][2]', 'header[3]': 'item[3][3]' })
converter.end()
```

## Accepted CSV format

This basically follows [RFC4180](https://datatracker.ietf.org/doc/html/rfc4180) but is more practical for convenience. This accepts a csv file that satisfy the following format.

- Fields must be Comma-Separated Values. (NOT Tab-Separated.)
- Fields can be enclosed in double-quotes to contain line breaks, double quotes and commas. (BUT a file cannot mix enclosed fields and not-enclosed fields.)
- A double-quote appearing inside a field must be escaped by preceding it with another double-quote or a backslash.
- This doesn't check a MIME Type such as text/csv.
