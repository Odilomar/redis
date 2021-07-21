import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import path from 'path';
import { config } from 'dotenv';

config();

const { REDIS_HOST, REDIS_PORT } = process.env;

@Module({
  imports: [RedisModule.register({ host: REDIS_HOST, port: Number(REDIS_PORT) })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
