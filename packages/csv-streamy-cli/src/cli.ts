import { program } from 'commander'
import { split } from './commands/split.js'
import { version } from './utils.js'

export function run(): void {
  program.name('csv').description('Command line tool to handle a csv file.').version(version())

  program
    .command('split')
    .description('split a csv file into pieces')
    .requiredOption('-f, --file <PATH>', 'a csv file path')
    .option('-h, --headers', 'if an input file has headers row')
    .option('-d, --double-quotes', 'if fields are enclosed in double-quotes')
    .option('-r, --rows <NUMBER>', 'NUMBER rows per an output file')
    .option('-b, --bytes <SIZE>', 'SIZE bytes per an output file')
    .option('-x, --extension', 'whether to add an extension to each output file')
    .option('-o, --output-dir <PATH>', 'an output directory path')
    .option('-v, --verbose', 'print a diagnostic just before each output file is opened')
    .action(split)

  program.parse()
}
