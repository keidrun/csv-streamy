import { defineConfig } from 'tsup'
import { globby } from 'globby'

export default async () =>
  defineConfig({
    entry: await globby(['src/**/*.ts', '!src/**/__tests__/**/*.ts']),
    target: ['node16', 'node17'],
    splitting: false, // only works with esm
    minify: true,
    outDir: 'build',
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
  })
