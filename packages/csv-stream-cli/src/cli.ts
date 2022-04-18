import { program } from 'commander'
import { split } from './commands/split.js'

const VERSION = '1.0.0'

export function run(): void {
  program.name('csv').description('Command line tool to handle a csv file.').version(VERSION)

  program
    .command('split')
    .description('split a csv file into pieces')
    .requiredOption('-f, --file <PATH>', 'a csv file path')
    .option('-h, --headers', 'if an input file has headers row')
    .option('-d, --double-quotes', 'if fields are enclosed in double-quotes')
    .option('-r, --rows <NUMBER>', 'NUMBER rows per an output file')
    .option('-b, --bytes <SIZE>', 'SIZE bytes per an output file')
    .option('-x, --file-extension', 'whether to add an extension to output files')
    .action(split)

  program.parse()
}