module.exports = {
  displayName: 'services-personal-representative-external',
  preset: '../../../jest.preset.js',
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory:
    '../../../coverage/apps/services/personal-representative-external',
  setupFiles: ['./test/environment.jest.ts'],
}
