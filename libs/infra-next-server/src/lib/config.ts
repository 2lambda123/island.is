import { resolve } from 'path'

/* eslint @typescript-eslint/no-var-requires: "off" */
export const getNextConfig = async (appDir: string, dev: boolean) => {
  const config = { dev }

  if (dev || process.env.API_MOCKS) {
    const { prepareConfig } = require('@nrwl/next/src/utils/config')
    const options = {
      root: `${appDir}`,
      outputPath: `dist/${appDir}`,
      fileReplacements: [],
    }
    const context = {
      root: process.cwd(),
    }

    // UPGRADE WARNING: Calling @nrwl/next internals. Be sure to test.
    // Only needs context.workspaceRoot in v10.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conf = await prepareConfig(
      'phase-development-server',
      options,
      context as any,
      [],
      resolve('libs'),
    )
    Object.assign(config, { conf, dir: appDir })
  }
  return config
}
