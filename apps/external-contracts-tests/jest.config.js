module.exports = {
  preset: './jest.preset.js',
  rootDir: '../..',
  roots: [__dirname],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  displayName: 'external-contracts-tests',
  modulePathIgnorePatterns: ['<rootDir>/main.spec.ts'],
  testEnvironment: 'node',
}
