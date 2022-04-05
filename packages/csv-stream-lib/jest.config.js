// https://kulshekhar.github.io/ts-jest/docs/guides/esm-support
export default {
  displayName: 'lib',
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['.*/__tests__/.*/.*.ts'],
}
