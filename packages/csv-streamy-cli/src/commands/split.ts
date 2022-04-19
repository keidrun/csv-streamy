import { resolve } from 'path'
import { pipeline } from 'stream/promises'
import { createReadStream, createWriteStream } from 'fs'
import { createCsvParser, createCsvConverter } from '@csv-streamy/lib'
import chalk from 'chalk'
import { toInt } from '../utils.js'

type SplitCommandArgs = {
  file: string
  headers?: boolean
  doubleQuotes?: boolean
  rows?: number
  bytes?: string
  fileExtension?: boolean
  outputDir?: string
  verbose?: boolean
}

export function split({
  file,
  headers = false,
  doubleQuotes = false,
  rows = NaN,
  bytes = '',
  fileExtension = false,
  outputDir = '',
  verbose = false,
}: SplitCommandArgs): void {
  const inputFilePath = resolve(file)
  const bytesNum = toInt(bytes)
  const outputDirPath = !outputDir ? resolve(process.cwd()) : resolve(outputDir)

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
    console.log(chalk.yellow('file-extension:', fileExtension))
    console.log(chalk.yellow('verbose:', verbose))
  }

  async function processRow(row: { [key: string]: string }) {
    for (const [header, field] of Object.entries(row)) {
      row[header] = field.toUpperCase()
    }
    return Promise.resolve(row)
  }

  async function run() {
    await pipeline(
      createReadStream(inputFilePath, { encoding: 'utf-8' }),
      createCsvParser({ hasHeaders: true, hasDoubleQuotes: true }),
      async function* (source) {
        for await (const row of source) {
          yield await processRow(row as { [key: string]: string })
        }
      },
      createCsvConverter({ hasHeaders: true, hasDoubleQuotes: true }),
      createWriteStream('output.csv', { encoding: 'utf-8' }),
    )
  }

  run().catch((error) => console.error(chalk.red(error)))
}

// if (!(await fs.access(inputFilePath))) {
//   console.log(chalk.green.yellow(`The file path specified by --file was not found. Path: '${inputFilePath}'`))
//   process.exit(1)
// }

// if (!(await fs.access(outputDirPath))) {
//   console.log(
//     chalk.green.yellow(`The directory path specified by --output-dir was not found. Path: '${outputDirPath}'`),
//   )
//   process.exit(1)
// }
