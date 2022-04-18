import chalk from 'chalk'
import { toInt } from '../utils.js'

type SplitCommandArgs = {
  file: string
  headers?: boolean
  doubleQuotes?: boolean
  rows?: number
  bytes?: string
  fileExtension?: boolean
}

export function split({
  file,
  headers = false,
  doubleQuotes = false,
  rows = NaN,
  bytes = '',
  fileExtension = false,
}: SplitCommandArgs): void {
  const bytesNum = toInt(bytes)

  if (!rows && !bytesNum) {
    console.log(chalk.green.yellow('--rows or --bytes option is required.'))
    process.exit(1)
  } else if (!!rows && !!bytesNum) {
    console.log(chalk.green.yellow('Only one --rows or --bytes can be specified.'))
    process.exit(1)
  }

  console.log(chalk.green.yellow('file:', file))
  console.log(chalk.green.yellow('headers:', headers))
  console.log(chalk.green.yellow('doubleQuotes:', doubleQuotes))
  console.log(chalk.green.yellow('rows:', rows))
  console.log(chalk.green.yellow('bytesNum:', bytesNum))
  console.log(chalk.green.yellow('fileExtension:', fileExtension))
}

// import * as fs from 'fs'
// import * as path from 'path'
// import { createCsvParser } from 'csv-streamy-lib'
// import { dirname } from 'dirfilename'

// const reader = fs.createReadStream(path.resolve(dirname(import.meta), 'input.csv'))
// const parser = createCsvParser({ hasHeaders: true, hasDoubleQuotes: true })

// console.log(path.resolve(`~/test`))
