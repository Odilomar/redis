import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RedisService } from 'nestjs-redis';

const expiresIn = '60d';
const noActivity = 5184000; // 60 days in seconds
const url = 'https://jsonplaceholder.typicode.com/albums';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  async getHello() {
    const redis = await this.redisService.getClient();
    const result = await redis.get('teste', async (error, value) => {
      if (error) console.log(error);

      if (value != null) {
        console.log("cache hit!");
        return value;
      }

      console.log("cache miss!");

      const { data } = await axios.get(url);
      await redis.setex('teste', noActivity, JSON.stringify(data));

      return data;
    });

    // console.log({ result });
  }
}
