import chalk from 'chalk'
// import { toInt } from '../utils.js'

// type SplitCommandArgs = {
//   file: string
//   rows: number
//   bytes: number
// }

// function validateArgs(args: SplitCommandArgs) {

// }

export function split(args: object) {
  console.log(chalk.green.bold(`${JSON.stringify(args)}`))
  // console.log(chalk.green.bold(`file: ${args.file}`))
  // console.log(chalk.green.bold(`rows: ${args.rows}`))
  // console.log(chalk.green.bold(`bytes: ${args.bytes}`))
}

/**
csv split [options] [input csv file] [output base file name]

csv split -r 10 input.csv

--rows -r
--bytes -b
--suffix-length -a
--additional-suffix -s
--extension -e
--verbose
*/

// import * as fs from 'fs'
// import * as path from 'path'
// import { createCsvParser } from 'csv-streamy-lib'
// import { dirname } from 'dirfilename'

// const reader = fs.createReadStream(path.resolve(dirname(import.meta), 'input.csv'))
// const parser = createCsvParser({ hasHeaders: true, hasDoubleQuotes: true })

// console.log(path.resolve(`~/test`))
