# @csv-streamy/cli

[![npm version](https://badge.fury.io/js/@csv-streamy%2Fcli.svg)](https://badge.fury.io/js/@csv-streamy%2Fcli) [![CI](https://github.com/keidrun/csv-stream/workflows/CI-cli/badge.svg)](https://github.com/keidrun/csv-stream/actions/workflows/csv-streamy-cli.yml) [![codecov](https://codecov.io/gh/keidrun/csv-stream/branch/main/graph/badge.svg?flag=csv-streamy-cli)](https://codecov.io/gh/keidrun/csv-stream/tree/main/packages/csv-stream-cli) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**CSV Streamy Cli** - Command line tool to handle a csv file.

## Install

```shell
npm i -g @csv-streamy/cli
```

## Usage

```shell
$ csv help
Usage: csv [options] [command]

Options:
  -h, --help       display help for command

Commands:
  split [options]  split a csv file into pieces
  help [command]   display help for command
```

### split a csv file into pieces

```shell
$ csv help split
Usage: csv split [options]

split a csv file into pieces

Options:
  -f, --file            a csv file path
  -h, --headers         if an input file has headers row
  -d, --double-quotes   if fields are enclosed in double-quotes
  -r, --rows <NUMBER>   NUMBER rows per an output file
  -b, --bytes <SIZE>    SIZE bytes per an output file
  -x, --file-extension  whether to add an extension to output files
  --help                display help for command
```
