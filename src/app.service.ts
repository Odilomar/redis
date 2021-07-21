import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RedisService } from 'nestjs-redis';

const expiresIn = '60d';
const noActivity = 10; // 60 days in seconds
const url = 'https://jsonplaceholder.typicode.com/albums';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  async getHello() {
    const redis = await this.redisService.getClient();
    const result = await redis.get('teste', async (error, value) => {
      if (error) console.log(error);
      if (value != null) return value;

      const { data } = await axios.get(url);
      await redis.setex('teste', noActivity, JSON.stringify(data));

      return data;
    });

    return result;
  }
}
