import { Injectable, InternalServerErrorException } from '@nestjs/common';
import to from 'await-to-js';
import { RedisService } from 'nestjs-redis';

const noActivity = 10;

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  async retrieveCache(key: string, callback: () => Promise<string>) {
    const redis = await this.redisService.getClient();

    const [getRedisError, keyData] = await to(redis.get(key));
    if (!!getRedisError) throw new InternalServerErrorException(getRedisError);
    if (keyData != null) return keyData;

    const [callbackError, callbackData] = await to(callback());
    if (!!callbackError) throw new InternalServerErrorException(callbackError);

    const [setRedisError] = await to(
      redis.setex(key, noActivity, callbackData),
    );
    if (!!setRedisError) throw new InternalServerErrorException(setRedisError);

    return callbackData;
  }
}
