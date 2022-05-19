import '@island.is/infra-tracing'

import createExpressApp, { Express } from 'express'
import type { Config } from 'http-proxy-middleware'
import next from 'next'

import { startMetricServer } from '@island.is/infra-metrics'
import { logger, monkeyPatchServerLogging } from '@island.is/logging'

import { getNextConfig } from './config'
import { ExternalEndpointDependencies, setupHealthchecks } from './health'
import { setupProxy } from './proxy'

type BootstrapOptions = {
  /**
   * Server name.
   */
  name: string

  /**
   * Path to next app.
   */
  appDir: string

  /**
   * Server port.
   */
  port?: number

  /**
   * Proxy configuration. Ignored in production (according to NODE_ENV).
   */
  proxyConfig?: { [context: string]: Config }

  /**
   * External dependencies to do DNS lookup for the /readiness healthcheck
   * If values needs to be read from the next config of the app you can provide
   * a callback function, which is called when the next config has loaded.
   */
  externalEndpointDependencies?: ExternalEndpointDependencies
}

const startServer = (app: Express, port = 4200) => {
  const nextPort = parseInt(process.env.PORT || '') || port
  const metricsPort = nextPort + 1
  app.listen(nextPort, () => {
    logger.info(
      `Next custom server listening at http://localhost:${nextPort}`,
      {
        context: 'Bootstrap',
      },
    )
  })
  startMetricServer(metricsPort)
}

const setupExitHook = () => {
  // Make sure the server doesn't hang after parent process disconnects, eg when
  // e2e tests are finished.
  if (process.env.NX_INVOKED_BY_RUNNER === 'true') {
    process.on('disconnect', () => {
      process.exit(0)
    })
  }
}

export const bootstrap = async (options: BootstrapOptions) => {
  const dev = process.env.NODE_ENV !== 'production'
  monkeyPatchServerLogging()

  setupExitHook()

  const expressApp = createExpressApp()

  await setupProxy(expressApp, options.proxyConfig, dev)

  const nextConfig = getNextConfig(options.appDir, dev)
  const nextApp = next(nextConfig)
  const handle = nextApp.getRequestHandler()

  setupHealthchecks(expressApp, options.externalEndpointDependencies)
  expressApp.all('*', (req, res) => handle(req, res))

  startServer(expressApp, options.port)

  await nextApp.prepare()
}
