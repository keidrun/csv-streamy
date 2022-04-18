#! /usr/bin/env node

import { program } from 'commander'
import { split } from '../commands/split.js'

program
  .command('split')
  .description('split a csv file into pieces')
  .requiredOption('-f, --file', '')
  .option('-r, --rows <NUMBER>', 'NUMBER rows per output file')
  .option('-b, --bytes <SIZE>', 'SIZE bytes per output file')
  .action(split)

program.parse()
