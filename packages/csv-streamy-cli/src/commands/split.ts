import { resolve, basename, extname } from 'path'
import { pipeline } from 'stream/promises'
import { access, mkdir } from 'fs/promises'
import { constants, createReadStream, createWriteStream } from 'fs'
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

function makeDirectoryIfDirectoryNotExists(dirPath: string) {
  return access(dirPath, constants.R_OK | constants.W_OK).catch(() => {
    if (dirPath) {
      return mkdir(dirPath)
    }
    return Promise.resolve()
  })
}

function* generateFilePath(dirPath: string, baseFilename: string, fileExtension: string) {
  let count = 0

  while (true) {
    count++
    yield resolve(dirPath, baseFilename + count.toString() + fileExtension)
  }
}

export async function split({
  file,
  headers = false,
  doubleQuotes = false,
  rows = NaN,
  bytes = '',
  extension = false,
  outputDir = '',
  verbose = false,
}: SplitCommandArgs): Promise<void> {
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

  try {
    await makeDirectoryIfDirectoryNotExists(outputDir)
  } catch (error) {
    if (error instanceof Error) {
      console.log(chalk.red(error.message))
    } else {
      console.log(chalk.red(error))
    }
    process.exit(1)
  }

  const genOutputFilePath = generateFilePath(outputDirPath, baseFilename, fileExtension)
  const newWriter = () => {
    const converter = createCsvConverter({ hasHeaders: headers, hasDoubleQuotes: doubleQuotes })
    const writer = createWriteStream(genOutputFilePath.next().value as string)
    converter
      .pipe(writer)
      .on('end', () => writer.end())
      .on('error', (error) => {
        console.log(chalk.red(error.message))
        process.exit(1)
      })
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
      return Promise.reject(new Error('Something went wrong.'))
    }

    if (isFirstRow) {
      if (isBytesMode) {
        if (amount > bytesNum) {
          return Promise.reject(
            new Error('The first row size of an input file is smaller than the size specified by --bytes.'),
          )
        }
      }

      writer = newWriter()
    }

    if (isRowsMode) {
      if (!isFirstRow && (count - 1) % rows === 0) {
        writer.end()
        writer = newWriter()
      }
      writer.write({ data })
    }

    if (isBytesMode) {
      const rowSize = amount - prevAmount
      if (total + rowSize > bytesNum) {
        total = 0
        writer.end()
        writer = newWriter()
      }
      writer.write({ data })
      total += rowSize
    }

    prevAmount = amount

    if (isFirstRow) isFirstRow = false
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
    console.log(chalk.green('Split an input file successfully.'))
  }

  run().catch((error: Error) => {
    console.log(chalk.red(error.message))
    process.exit(1)
  })
}
