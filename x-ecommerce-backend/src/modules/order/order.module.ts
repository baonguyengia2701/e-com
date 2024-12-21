import { Module } from '@nestjs/common';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { RedisModule } from '@/share/services/redis/redis.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.model';

@Module({
  imports: [
    CartModule,
    ProductModule,
    RedisModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
