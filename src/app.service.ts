import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import to from 'await-to-js';
import axios from 'axios';
import { CacheService } from './cache/cache.service';

const url = 'https://jsonplaceholder.typicode.com/photos';
const defaultRedisKey = 'teste';
const noActivity = 10; // 60 days in seconds

@Injectable()
export class AppService {
  constructor(
    @Inject(forwardRef(() => CacheService))
    private readonly cacheService: CacheService
  ) {}

  async getHello(albumId: number) {
    const cacheKey = albumId
      ? `${defaultRedisKey}?albumId=${albumId}`
      : defaultRedisKey;
    const apiUrl = albumId ? `${url}?albumId=${albumId}` : url;

    const callback = async (): Promise<string> => {
      const [err, { data }] = await to(axios.get(apiUrl));
      if(!!err) throw new InternalServerErrorException(err);
      
      return data;
    };

    return this.cacheService.retrieveCache(cacheKey, callback);
  }
}
