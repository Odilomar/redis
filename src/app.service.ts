import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import to from 'await-to-js';
import axios from 'axios';
import { CacheService } from './cache/cache.service';

const url = 'https://jsonplaceholder.typicode.com/photos';
const defaultRedisKey = 'teste';

@Injectable()
export class AppService {
  constructor(
    @Inject(forwardRef(() => CacheService))
    private readonly cacheService: CacheService,
  ) {}

  async getHello(albumId: number) {
    const customParam = (value: string) =>
      albumId ? `${value}?albumId=${albumId}` : value;

    const cacheKey = customParam(defaultRedisKey);
    const apiUrl = customParam(url);

    const callback = async () => {
      const [err, { data }] = await to(axios.get(apiUrl));
      if (!!err) throw new InternalServerErrorException(err);

      return data;
    };

    return this.cacheService.retrieveCache(cacheKey, callback);
  }
}
