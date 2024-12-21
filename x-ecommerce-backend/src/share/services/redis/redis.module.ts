import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ProductModule } from '@/modules/product/product.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ProductModule,
    BullModule.forRootAsync({
      imports: [],
      useFactory: async () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
        },
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
