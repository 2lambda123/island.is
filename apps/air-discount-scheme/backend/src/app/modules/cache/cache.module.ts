import { CacheModule as NestCacheModule } from '@nestjs/common'
import * as redisStore from 'cache-manager-ioredis'
import { createNestJSCache } from '@island.is/cache'
import { environment } from '../../../environments'

const { redis, production } = environment

export const CacheModule = NestCacheModule.register({
  store: redisStore,
  redisInstance: createNestJSCache({
    name: 'air_discount_scheme_backend_service_cache',
    ssl: production,
    nodes: redis.urls,
  }),
})
