# @csv-streamy/lib

[![npm version](https://badge.fury.io/js/@csv-streamy%2Flib.svg)](https://badge.fury.io/js/@csv-streamy%2Flib) [![CI](https://github.com/keidrun/csv-streamy/workflows/CI-lib/badge.svg)](https://github.com/keidrun/csv-streamy/actions/workflows/csv-streamy-lib.yml) [![codecov](https://codecov.io/gh/keidrun/csv-streamy/branch/main/graph/badge.svg?flag=csv-streamy-lib)](https://codecov.io/gh/keidrun/csv-streamy/tree/main/packages/csv-streamy-lib) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**CSV Streamy Lib** - CSV Stream library for Node.js.

## Install

```shell
npm i @csv-streamy/lib
```

## Quick examples

### Read and Write your CSV file

```typescript
import { resolve } from 'path'
import { pipeline } from 'stream/promises'
import { createReadStream, createWriteStream } from 'fs'
import { createCsvParser, createCsvConverter, CsvRowData } from '@csv-streamy/lib'

// For example, it just converts all fields to uppercase letters.
async function processRow({ data }: CsvRowData): Promise<CsvRowData> {
  for (const [header, field] of Object.entries(data)) {
    data[header] = field.toUpperCase()
  }
  return Promise.resolve({ data })
}

async function run() {
  await pipeline(
    createReadStream(resolve(__dirname, 'input.csv'), { encoding: 'utf-8' }),
    createCsvParser({ hasHeaders: true, hasDoubleQuotes: true }),
    async function* (source) {
      for await (const row of source) {
        yield await processRow(row as CsvRowData)
      }
    },
    createCsvConverter({ hasHeaders: true, hasDoubleQuotes: true }),
    createWriteStream(resolve(__dirname, 'output.csv'), { encoding: 'utf-8' }),
  )
  console.log('Woo-hoo! Succeeded!!')
}

run().catch(console.error)
```

### Read and Write your CSV file with `stat`

```typescript
import { resolve } from 'path'
import { pipeline } from 'stream/promises'
import { createReadStream, createWriteStream } from 'fs'
import { createCsvParser, createCsvConverter, CsvRowData } from '@csv-streamy/lib'

// You can observe the number of row as `count` and the bytes of data as `amount` in `stat`.
// For example, it converts all fields to uppercase letters if `count` is even
// or it capitalizes all fields if `amount` is 200 bytes or more.
async function processRow({ data, stat }: CsvRowData): Promise<CsvRowData> {
  const { count, amount } = { ...stat }
  if (!!count && count % 2 === 0) {
    for (const [header, field] of Object.entries(data)) {
      data[header] = field.toUpperCase()
    }
  } else if (!!amount && amount >= 200) {
    for (const [header, field] of Object.entries(data)) {
      data[header] = field.charAt(0).toUpperCase() + field.slice(1)
    }
  }
  return Promise.resolve({ data })
}

async function run() {
  await pipeline(
    createReadStream(resolve(__dirname, 'input.csv'), { encoding: 'utf-8' }),
    createCsvParser({ hasHeaders: true, hasDoubleQuotes: true }),
    async function* (source) {
      for await (const row of source) {
        yield await processRow(row as CsvRowData)
      }
    },
    createCsvConverter({ hasHeaders: true, hasDoubleQuotes: true }),
    createWriteStream(resolve(__dirname, 'output.csv'), { encoding: 'utf-8' }),
  )
  console.log('Great! Perfect!!')
}

run().catch(console.error)
```

### Using ES Modules (ESM)

If you want to use [ES Modules](https://nodejs.org/api/esm.html#modules-ecmascript-modules), you can do it as follows.

```typescript
import { resolve } from 'path'
import { dirname } from 'dirfilename'
import { pipeline } from 'stream/promises'
import { createReadStream, createWriteStream } from 'fs'
import { createCsvParser, createCsvConverter, CsvRowData } from '@csv-streamy/lib'

// Workaround to simply use `__dirname` because CommonJS variables are not available in ES modules.
const __dirname = dirname(import.meta)

async function processRow({ data }: CsvRowData): Promise<CsvRowData> {
  for (const [header, field] of Object.entries(data)) {
    data[header] = field.toUpperCase()
  }
  return Promise.resolve({ data })
}

async function run() {
  await pipeline(
    createReadStream(resolve(__dirname, 'input.csv'), { encoding: 'utf-8' }),
    createCsvParser({ hasHeaders: true, hasDoubleQuotes: true }),
    async function* (source) {
      for await (const row of source) {
        yield await processRow(row as CsvRowData)
      }
    },
    createCsvConverter({ hasHeaders: true, hasDoubleQuotes: true }),
    createWriteStream(resolve(__dirname, 'output.csv'), { encoding: 'utf-8' }),
  )
  console.log('Woo-hoo! Succeeded!!')
}

run().catch(console.error)
```

### Using CommonJS

If you want to use [CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules) in just Node.js, you can do it as follows.

```typescript
const { resolve } = require('path')
const { pipeline } = require('stream/promises')
const { createReadStream, createWriteStream } = require('fs')
const { createCsvParser, createCsvConverter } = require('@csv-streamy/lib')

async function processRow({ data }) {
  for (const [header, field] of Object.entries(data)) {
    data[header] = field.toUpperCase()
  }
  return Promise.resolve({ data })
}

async function run() {
  await pipeline(
    createReadStream(resolve(__dirname, 'input.csv'), { encoding: 'utf-8' }),
    createCsvParser({ hasHeaders: true, hasDoubleQuotes: true }),
    async function* (source) {
      for await (const row of source) {
        yield await processRow(row)
      }
    },
    createCsvConverter({ hasHeaders: true, hasDoubleQuotes: true }),
    createWriteStream(resolve(__dirname, 'output.csv'), { encoding: 'utf-8' })
  );
  console.log('Woo-hoo! Succeeded!!')
}

run().catch(console.error)
```

## Usage

### Parsing

You can parse your csv file, which can contain headers and enclose fields in double-quotes, to handy objects.
Each object contains fields per row as `data` and statistics data as `stat`, which contains the number of row as `count` and the bytes of data as `amount`.

```typescript
import { resolve } from 'path'
import { dirname } from 'dirfilename'
import { createReadStream } from 'fs'
import { createCsvParser } from '@csv-streamy/lib'

const reader = createReadStream(resolve(__dirname, 'input.csv'))
const parser = createCsvParser({ hasHeaders: true, hasDoubleQuotes: true })

reader
  .pipe(parser)
  .on('error', (error) => console.log(error))
  .on('data', (row) => console.log(row))
  .on('end', () => console.log('End'))
```

- Input

```csv
"header[1]","header[2]","header[3]","header[4]","header[5]"
"item[1][1]","item[1][2]","item[1][3]","item[1][4]","item[1][5]"
"item[2][1]","item[2][2]","item[2][3]","item[2][4]","item[2][5]"
```

- Output

```shell
{
  data: {
    'header[1]': 'item[1][1]',
    'header[2]': 'item[1][2]',
    'header[3]': 'item[1][3]',
    'header[4]': 'item[1][4]',
    'header[5]': 'item[1][5]'
  },
  stat: { count: 1, amount: 64 }
}
{
  data: {
    'header[1]': 'item[2][1]',
    'header[2]': 'item[2][2]',
    'header[3]': 'item[2][3]',
    'header[4]': 'item[2][4]',
    'header[5]': 'item[2][5]'
  },
  stat: { count: 2, amount: 128 }
}
End
```

### Converting

You can convert your handy objects with `data` to csv format strings, which can contain headers and enclose fields in double-quotes, then create buffer stream.

```typescript
import { createCsvConverter } from '@csv-streamy/lib'

const converter = createCsvConverter({ hasHeaders: true, hasDoubleQuotes: true })

converter.pipe(process.stdout).on('end', () => process.exit())

converter.write({ data: { 'header[1]': 'item[1][1]', 'header[2]': 'item[1][2]', 'header[3]': 'item[1][3]' } })
converter.write({ data: { 'header[1]': 'item[2][1]', 'header[2]': 'item[2][2]', 'header[3]': 'item[2][3]' } })
converter.write({ data: { 'header[1]': 'item[3][1]', 'header[2]': 'item[3][2]', 'header[3]': 'item[3][3]' } })
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
import { resolve } from 'path'
import { dirname } from 'dirfilename'
import { createWriteStream } from 'fs'
import { createCsvConverter } from '@csv-streamy/lib'

const converter = createCsvConverter({ hasHeaders: true, hasDoubleQuotes: true })
const writer = createWriteStream(resolve(__dirname, 'output.csv'))

converter.pipe(writer).on('end', () => writer.end())

converter.write({ data: { 'header[1]': 'item[1][1]', 'header[2]': 'item[1][2]', 'header[3]': 'item[1][3]' } })
converter.write({ data: { 'header[1]': 'item[2][1]', 'header[2]': 'item[2][2]', 'header[3]': 'item[2][3]' } })
converter.write({ data: { 'header[1]': 'item[3][1]', 'header[2]': 'item[3][2]', 'header[3]': 'item[3][3]' } })
converter.end()
```

## Acceptable CSV format

This basically follows [RFC4180](https://datatracker.ietf.org/doc/html/rfc4180) but additionally needs to meet the following rules to make a common csv file easier to use:

- Fields must be Comma-Separated Values. (NOT Tab-Separated.)
- Fields can be enclosed in double-quotes to contain line breaks, double quotes and commas. (BUT a file cannot mix enclosed fields and not-enclosed fields.)
- A double-quote appearing inside a field must be escaped by preceding it with another double-quote or a backslash.
- This doesn't check a MIME Type such as text/csv.
