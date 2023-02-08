import { CacheModule, Module } from '@nestjs/common';
import { InternalCacheService } from './internal-cache.service';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '../config/env.config';

@Module({
  imports: [
    CacheModule.registerAsync<ClientOpts>({
      useFactory: async () => ({
        store: redisStore,
        password: REDIS_PASSWORD,
        host: REDIS_HOST,
        port: REDIS_PORT,
        ttl: 60 * 5,
      }),
    }),
  ],
  providers: [InternalCacheService],
  exports: [InternalCacheService],
})
export class InternalCacheModule {}
