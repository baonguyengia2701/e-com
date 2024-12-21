import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './configs/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ImageModule } from './modules/image/image.module';
import { OtpModule } from './modules/otp/otp.module';
import { ProductModule } from './modules/product/product.module';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { LoggerMiddleware } from './share/middlewares/logger.middleware';
import { CartModule } from './modules/cart/cart.module';
import { HistoryModule } from './modules/history/history.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    UserModule,
    CategoryModule,
    ProductModule,
    ImageModule,
    RoleModule,
    OtpModule,
    CartModule,
    HistoryModule,
    OrderModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
