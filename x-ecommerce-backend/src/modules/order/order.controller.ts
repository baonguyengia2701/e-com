import { Body, Controller, Get, Param, Post, UseGuards, Query } from '@nestjs/common';
import { ICheckoutReview } from './order.interface';
import { OrderService } from './order.service';
import { MakeOrderDto } from './dto/make-order.dto';
import { API_CONFIG } from '@/configs/constant.config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/guard/jwt-access-token.guard';
import { GetUser } from '@/share/decorator/get-user.decorator';
import { Order } from './order.model';
import { OrderFilterDto } from './dto/query-param.dto';
import { IResponseList } from '@/share/common/app.interface';

@Controller({
  version: [API_CONFIG.VERSION_V1],
  path: 'orders',
})
@ApiTags('Order')
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getOrdersList(@Query() filterDto: OrderFilterDto): Promise<IResponseList<Order>> {
    return this.orderService.getListOrders(filterDto);
  }

  @Get('checkout-review/:cartId')
  checkOut(@Param('cartId') cartId: string): Promise<ICheckoutReview> {
    return this.orderService.checkoutReview(cartId);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post()
  makeOrder(@Body() body: MakeOrderDto, @GetUser() user): Promise<Order> {
    return this.orderService.createOrder(body, user);
  }
}
