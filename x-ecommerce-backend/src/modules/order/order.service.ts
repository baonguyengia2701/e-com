import { BadRequestException, Injectable } from '@nestjs/common';
import { Order, OrderDocument, OrderStatus } from './order.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { ERROR } from '@/share/common/error-code.const';
import { ProductService } from '../product/product.service';
import { ICheckoutReview } from './order.interface';
import { RedisService } from '@/share/services/redis/redis.service';
import { MakeOrderDto } from './dto/make-order.dto';
import { IPaginateParams, IResponseList } from '@/share/common/app.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly redisService: RedisService,
  ) {}

  async getListOrders(params: IPaginateParams): Promise<IResponseList<OrderDocument>> {
    const page = params.page && params.page > 0 ? Number(params.page) : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? Number(params.pageSize) : 100;

    const conditions: any = {};
    let sortOption: any = {};
    if (params.search) {
      conditions['productInfo.name'] = { $regex: new RegExp(params.search, 'i') };
    }
    if (params.status) {
      conditions.status = params.status;
    }
    if (params?.sortBy === 'totalPrice') {
      sortOption = {
        'checkoutInfo.totalPrice': params.sortOrder === 'desc' ? -1 : 1,
      };
    } else if (params?.sortBy) {
      sortOption = {
        [params.sortBy]: params.sortOrder === 'desc' ? -1 : 1,
      };
    }

    const results = await this.orderModel.aggregate([
      {
        $facet: {
          documents: [
            { $match: conditions },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            { $sort: sortOption },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);

    const data = results[0].documents;
    const total = results[0].totalCount.length > 0 ? results[0].totalCount[0].count : 0;
    const totalPage = total % pageSize === 0 ? total / pageSize : Math.floor(total / pageSize) + 1;

    return {
      data,
      total,
      totalPage,
      page,
      pageSize,
    };
  }

  // for Login and without login
  async checkoutReview(cartId: string): Promise<ICheckoutReview> {
    const cartExists = await this.cartService.findById(cartId);
    if (!cartExists) {
      throw new BadRequestException(ERROR.CART_NOT_FOUND.MESSAGE, ERROR.CART_NOT_FOUND.CODE);
    }

    const products = await this.productService.checkProductExist(cartExists.products);
    if (products.length !== cartExists.products.length) {
      throw new BadRequestException(ERROR.PRODUCT_NOT_FOUND.MESSAGE, ERROR.PRODUCT_NOT_FOUND.CODE);
    }

    const checkoutPrice = products.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    //TODO: add discount logic here

    return {
      totalPrice: checkoutPrice,
      products,
    };
  }

  async createOrder(body: MakeOrderDto, user?: any): Promise<Order> {
    // TODO: handle create order without login

    const { cartId, paymentInfo, shippingInfo } = body;
    const { totalPrice, products } = await this.checkoutReview(cartId);

    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const lockKey = await this.redisService.acquireLockProduct(productId, quantity, 3000);

      acquireProduct.push(lockKey ? true : false);

      if (lockKey) {
        await this.redisService.releaseLock(lockKey);
      }
    }

    // neu co 1 san pham het hang thi throw exception
    if (acquireProduct.includes(false)) {
      throw new BadRequestException(ERROR.PRODUCT_OUT_OF_STOCK.MESSAGE, ERROR.PRODUCT_OUT_OF_STOCK.CODE);
    }

    const newOrder = await this.orderModel.create({
      userId: user ? user._id : null,
      checkoutInfo: {
        totalPrice,
      },
      shippingInfo,
      paymentInfo,
      productInfo: products,
      status: OrderStatus.PENDING,
    });

    // xoa product trong cart
    await this.cartService.clearProductInCart(cartId);

    return newOrder;
  }
}
