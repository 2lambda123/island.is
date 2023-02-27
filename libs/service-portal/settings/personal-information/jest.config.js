module.exports = {
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory:
    '<rootDir>/coverage/libs/service-portal/settings/personal-information',
  globals: { 'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` } },
  displayName: 'service-portal-settings',
}
