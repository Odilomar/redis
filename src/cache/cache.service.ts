import { Injectable, InternalServerErrorException } from '@nestjs/common';
import to from 'await-to-js';
import { RedisService } from 'nestjs-redis';

const noActivity = 10;

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  async retrieveCache(key: string, callback: () => Promise<string>) {
    const redis = await this.redisService.getClient();

    const [err, keyData] = await to(redis.get(key));
    if (!!err) throw new InternalServerErrorException(err);
    if (keyData != null) return keyData;

    const [error, callbackData] = await to(Promise.resolve(callback()));
    if (!!error) throw new InternalServerErrorException(error);

    await redis.setex(key, noActivity, JSON.stringify(callbackData));

    return callbackData;
  }
}
