import { QueryParamBaseDto } from '@/share/common/dto/query-param.dto';
import { GetUser } from '@/share/decorator/get-user.decorator';
import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/guard/jwt-access-token.guard';
import { User } from '../user/user.model';
import { Cart } from './cart.model';
import { CartService } from './cart.service';
import { CartProductDto } from './dto/cart-product.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { PaginationQueryPipe } from '@/share/pipes/pagination-query.pipe';

@UseGuards(JwtAccessTokenGuard)
@Controller('carts')
@ApiTags('Carts')
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UsePipes(new PaginationQueryPipe())
  @Get()
  getCart(@Query() queryCartDto: QueryParamBaseDto, @GetUser() user: User): Promise<Cart> {
    return this.cartService.getCart(user._id, queryCartDto);
  }

  @UsePipes(new PaginationQueryPipe())
  @Post('add-to-cart')
  addToCart(@Body() createCartDto: CartProductDto, @GetUser() user: User): Promise<Cart> {
    return this.cartService.addToCart(createCartDto, user._id);
  }

  @UsePipes(new PaginationQueryPipe())
  @Put('update-quantity')
  updateQuantity(
    @Query() queryCartDto: QueryParamBaseDto,
    @Body() updateQuantityDto: UpdateQuantityDto,
    @GetUser() user: User,
  ): Promise<Cart> {
    return this.cartService.updateQuantity(updateQuantityDto, user._id, queryCartDto);
  }

  @UsePipes(new PaginationQueryPipe())
  @Delete('remove-from-cart')
  removeFromCart(
    @Query() queryCartDto: QueryParamBaseDto,
    @Body() createCartDto: CartProductDto,
    @GetUser() user: User,
  ): Promise<Cart> {
    return this.cartService.removeFromCart(createCartDto, user._id, queryCartDto);
  }

  @Put()
  updateCart(@Body() updateCartDto: UpdateCartDto, @GetUser() user: User): Promise<Cart> {
    return this.cartService.updateCart(updateCartDto, user._id);
  }

  @Post('migrate')
  migrateCartSchema(): Promise<string> {
    return this.cartService.migrateCartSchema();
  }
}
