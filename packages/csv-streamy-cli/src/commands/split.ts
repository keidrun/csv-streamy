import { resolve, basename, extname } from 'path'
import { pipeline } from 'stream/promises'
import { createReadStream, createWriteStream } from 'fs'
import { createCsvParser, createCsvConverter, CsvRowData, CsvTransformStream } from '@csv-streamy/lib'
import chalk from 'chalk'
import { toInt } from '../utils.js'

type SplitCommandArgs = {
  file: string
  headers?: boolean
  doubleQuotes?: boolean
  rows?: number
  bytes?: string
  extension?: boolean
  outputDir?: string
  verbose?: boolean
}

function* generateFilePath(dirPath: string, baseFilename: string, fileExtension: string) {
  let count = 0

  while (true) {
    count++
    yield resolve(dirPath, baseFilename + count.toString() + fileExtension)
  }
}

export function split({
  file,
  headers = false,
  doubleQuotes = false,
  rows = NaN,
  bytes = '',
  extension = false,
  outputDir = '',
  verbose = false,
}: SplitCommandArgs): void {
  const inputFilePath = resolve(file)
  const bytesNum = toInt(bytes)
  const outputDirPath = !outputDir ? resolve(process.cwd()) : resolve(outputDir)
  const fileExtension = extension ? extname(inputFilePath) : ''
  const baseFilename = basename(inputFilePath, fileExtension)

  if (!rows && !bytesNum) {
    console.log(chalk.green.yellow('--rows or --bytes option is required.'))
    process.exit(1)
  } else if (!!rows && !!bytesNum) {
    console.log(chalk.green.yellow('Only one --rows or --bytes can be specified.'))
    process.exit(1)
  }

  if (verbose) {
    console.log(chalk.yellow('file:', inputFilePath))
    console.log(chalk.yellow('output-dir:', outputDirPath))
    console.log(chalk.yellow('headers:', headers))
    console.log(chalk.yellow('double-quotes:', doubleQuotes))
    console.log(chalk.yellow('rows:', rows))
    console.log(chalk.yellow('bytes:', bytesNum))
    console.log(chalk.yellow('extension:', extension))
    console.log(chalk.yellow('verbose:', verbose))
  }

  const genOutputFilePath = generateFilePath(outputDirPath, baseFilename, fileExtension)
  const newWriter = () => {
    const converter = createCsvConverter({ hasHeaders: headers, hasDoubleQuotes: doubleQuotes })
    const writer = createWriteStream(genOutputFilePath.next().value as string)
    converter.pipe(writer).on('end', () => writer.end())
    return converter
  }

  const isRowsMode = !!rows && !bytesNum
  const isBytesMode = !rows && !!bytesNum
  let writer: CsvTransformStream<CsvRowData>
  let isFirstRow = true
  let prevAmount = 0
  let total = 0
  async function processRow({ data, stat }: CsvRowData): Promise<void> {
    const { count, amount } = { ...stat }

    if (!count || !amount) {
      return Promise.resolve()
    }

    const rowSize = amount - prevAmount

    if (isFirstRow) {
      if (isBytesMode) {
        if (amount > bytesNum) {
          return Promise.reject('The first row size of an input file is smaller than the size specified by --bytes.')
        }
      }

      writer = newWriter()
      isFirstRow = false
    }

    if (isRowsMode) {
      writer.write({ data })
      if (count % rows === 0) {
        writer.end()
        writer = newWriter()
      }
    }

    if (isBytesMode) {
      if (total + rowSize > bytesNum) {
        console.log('NEW FILE')
        total = 0
        writer.end()
        writer = newWriter()
      }
      writer.write({ data })
      total += rowSize
    }

    prevAmount = amount

    return Promise.resolve()
  }

  async function run() {
    await pipeline(
      createReadStream(inputFilePath),
      createCsvParser({ hasHeaders: headers, hasDoubleQuotes: doubleQuotes }),
      async function* (source) {
        for await (const row of source) {
          yield await processRow(row as CsvRowData)
        }
      },
    )
  }

  run().catch((error) => {
    console.error(chalk.red(error))
    process.exit(1)
  })
}
