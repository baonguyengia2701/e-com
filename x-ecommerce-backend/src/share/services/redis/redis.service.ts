import { ProductService } from '@/modules/product/product.service';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor(private readonly productService: ProductService) {}
  async onModuleInit() {
    // Initialize Redis client
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      retryStrategy(times) {
        return Math.min(times * 50, 2000);
      },
    });

    // Handle connection errors
    this.redisClient.on('error', error => {
      console.error('Redis connection error:', error);
    });

    // Handle reconnection attempts
    this.redisClient.on('reconnecting', () => {
      console.log('Reconnecting to Redis...');
    });

    // Confirm connection
    this.redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });
  }

  onModuleDestroy() {
    if (this.redisClient) {
      this.redisClient.quit();
    }
  }

  async acquireLockProduct(productId: string, quantity: number, lockTimeout: number): Promise<string> {
    const lockKey = `lock:product:${productId}`;
    const retryTimes = 10;
    for (let i = 0; i < retryTimes; i++) {
      const result = await this.redisClient.setnx(lockKey, String(lockTimeout));
      if (result) {
        const isMinusInventory = await this.productService.minusInventory({ productId, quantity });
        if (isMinusInventory) {
          await this.redisClient.pexpire(lockKey, lockTimeout);
          return lockKey;
        }

        return null;
      } else {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  async releaseLock(lockKey: string): Promise<number> {
    return this.redisClient.del(lockKey);
  }
}
