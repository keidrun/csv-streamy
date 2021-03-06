# @csv-streamy/cli

[![npm version](https://badge.fury.io/js/@csv-streamy%2Fcli.svg)](https://badge.fury.io/js/@csv-streamy%2Fcli) [![CI](https://github.com/keidrun/csv-streamy/workflows/CI-cli/badge.svg)](https://github.com/keidrun/csv-streamy/actions/workflows/csv-streamy-cli.yml) [![codecov](https://codecov.io/gh/keidrun/csv-streamy/branch/main/graph/badge.svg?flag=csv-streamy-cli)](https://codecov.io/gh/keidrun/csv-streamy/tree/main/packages/csv-streamy-cli) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**CSV Streamy Cli** - Command line tool to handle a csv file.

## Install

```shell
npm i -g @csv-streamy/cli
```

## Usage

```shell
$ csv help
Usage: csv [options] [command]

Command line tool to handle a csv file.

Options:
  -V, --version    output the version number
  -h, --help       display help for command

Commands:
  split [options]  split a csv file into pieces
  help [command]   display help for command
```

### Split a csv file into pieces

```shell
$ csv help split
Usage: csv split [options]

split a csv file into pieces

Options:
  -f, --file <PATH>        a csv file path
  -h, --headers            if an input file has headers row
  -d, --double-quotes      if fields are enclosed in double-quotes
  -r, --rows <NUMBER>      NUMBER rows per an output file
  -b, --bytes <SIZE>       SIZE bytes per an output file
  -x, --extension          whether to add an extension to each output file
  -o, --output-dir <PATH>  an output directory path
  -v, --verbose            print a diagnostic just before each output file is opened
  --help                   display help for command
```

### Examples

```bash
# When you want to split your csv file per 10 rows
$ csv split -f input.csv -o out -h -d -x -r 10

# When you want to split your csv file per 1K bytes except the size of headers
$ csv split -f input.csv -o out -h -d -x -b 1K
```
