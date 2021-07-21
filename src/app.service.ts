import { Injectable, InternalServerErrorException } from '@nestjs/common';
import to from 'await-to-js';
import axios from 'axios';
import { RedisService } from 'nestjs-redis';

const expiresIn = '60d';
const noActivity = 10; // 60 days in seconds
const url = 'https://jsonplaceholder.typicode.com/photos';
const defaultRedisKey = 'teste';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  private async retrieveCache(key: string, callback: () => Promise<string>) {
    const redis = await this.redisService.getClient();

    const [err, keyData] = await to(redis.get(key));
    if (!!err) throw new InternalServerErrorException(err);
    if (keyData != null) return keyData;

    const [error, callbackData] = await to(Promise.resolve(callback()));
    if (!!error) throw new InternalServerErrorException(error);

    await redis.setex(key, noActivity, JSON.stringify(callbackData));

    return callbackData;
  }

  async getHello(albumId: number) {
    const cacheKey = albumId
      ? `${defaultRedisKey}?albumId=${albumId}`
      : defaultRedisKey;
    const apiUrl = albumId ? `${url}?albumId=${albumId}` : url;

    const callback = async (): Promise<string> => {
      const { data } = await axios.get(apiUrl);
      return data;
    };

    return this.retrieveCache(cacheKey, callback);
  }
}
