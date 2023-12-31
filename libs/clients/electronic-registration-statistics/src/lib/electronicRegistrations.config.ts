import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  url: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
})

export const ElectronicRegistrationsClientConfig = defineConfig({
  name: 'ElectronicRegistrationsApi',
  schema,
  load(env) {
    return {
      url: env.required(
        'ELECTRONIC_REGISTRATION_STATISTICS_API_URL',
        'https://api-staging.thinglysing.is/business/tolfraedi',
      ),
      fetch: {
        timeout:
          env.optionalJSON('ELECTRONIC_REGISTRATIONS_API_TIMEOUT') ?? 30000,
      },
    }
  },
})
