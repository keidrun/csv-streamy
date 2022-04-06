import * as fs from 'fs'
import * as path from 'path'
import { createCsvParser } from '@csv-stream/lib'

const reader = fs.createReadStream(path.resolve(__dirname, 'your.csv'))
const parser = createCsvParser({ hasHeaders: true, hasDoubleQuotes: true })

reader
  .pipe(parser)
  .on('error', (error: Error) => console.log(error))
  .on('data', (row) => console.log(row))
  .on('end', () => console.log('Done!'))
