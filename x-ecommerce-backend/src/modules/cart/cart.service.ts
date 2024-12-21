import { QueryParamBaseDto } from '@/share/common/dto/query-param.dto';
import { ERROR } from '@/share/common/error-code.const';
import MessageConstants from '@/share/common/message.constants';
import { UpdateQuantityType } from '@/share/types/enum';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType, Types } from 'mongoose';
import { Product } from '../product/product.model';
import { ProductService } from '../product/product.service';
import { Cart } from './cart.model';
import { CartProductDto } from './dto/cart-product.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { QUERY_PARAM_DEFAULTS } from '@/share/common/app.const';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
    private readonly productService: ProductService,
  ) {}

  // TODO: create a base service and extexnd it
  findById(id: string): Promise<Cart> {
    return this.cartModel.findById(id);
  }

  async getCart(userId: string, queryCartDto: QueryParamBaseDto): Promise<Cart> {
    let foundCart = await this.cartModel.findOne(
      {
        userId,
      },
      {
        products: {
          $slice: [queryCartDto.pageSize * queryCartDto.page, queryCartDto.pageSize * (queryCartDto.page + 1)],
        },
      },
    );

    if (!foundCart) {
      foundCart = await this.cartModel.create({
        products: [],
        userId,
        totalProducts: 0,
        totalPrice: 0,
      });
    }

    return this.populateCart(foundCart);
  }

  // add to cart and increase quantity
  async addToCart(cartProductDto: CartProductDto, userId: string): Promise<Cart> {
    const [foundProduct, foundCart] = await Promise.all([
      this.findProduct(cartProductDto.productId),
      this.findCart(userId, cartProductDto.productId),
    ]);

    let resultCart: Cart;
    if (!foundCart.products || foundCart.products.length === 0) {
      resultCart = await this.handleAddNewProductToCart(foundCart, foundProduct, cartProductDto);
    } else {
      resultCart = await this.increaseOrDecreaseQuantity(
        foundCart,
        foundProduct,
        {
          ...cartProductDto,
          type: UpdateQuantityType.INCREASE,
        },
        QUERY_PARAM_DEFAULTS,
      );
    }

    return this.populateCart(resultCart);
  }

  async removeFromCart(cartProductDto: CartProductDto, userId: string, queryCartDto: QueryParamBaseDto): Promise<Cart> {
    const [foundProduct, foundCart] = await Promise.all([
      this.findProduct(cartProductDto.productId),
      this.findCart(userId, cartProductDto.productId),
    ]);

    const resultCart = await this.handleRemoveProductFromCart(foundCart, foundProduct, queryCartDto);

    return this.populateCart(resultCart);
  }

  async updateQuantity(
    updateQuantityDto: UpdateQuantityDto,
    userId: string,
    queryCartDto: QueryParamBaseDto,
  ): Promise<Cart> {
    const [foundProduct, foundCart] = await Promise.all([
      this.findProduct(updateQuantityDto.productId),
      this.findCart(userId, updateQuantityDto.productId),
    ]);

    let resultCart: Cart;

    if (updateQuantityDto.type === UpdateQuantityType.DECREASE) {
      if (foundCart.products[0]?.quantity < updateQuantityDto.quantity)
        throw new BadRequestException(MessageConstants.QUANTITY_IS_EXCEED_ALLOWED_QUANTITY);
      else if (foundCart.products[0]?.quantity === updateQuantityDto.quantity) {
        resultCart = await this.handleRemoveProductFromCart(foundCart, foundProduct, queryCartDto);
        return this.populateCart(foundCart);
      }
    }

    resultCart = await this.increaseOrDecreaseQuantity(foundCart, foundProduct, updateQuantityDto, queryCartDto);
    return this.populateCart(resultCart);
  }

  async handleAddNewProductToCart(
    foundCart: Cart,
    foundProduct: Product,
    cartProductDto: CartProductDto,
  ): Promise<Cart> {
    return this.cartModel.findOneAndUpdate(
      {
        userId: foundCart.userId,
      },
      {
        $push: {
          products: {
            $each: [{ productId: cartProductDto.productId, quantity: cartProductDto.quantity }],
            $position: 0,
          },
        },
        $inc: {
          totalProducts: cartProductDto.quantity,
          totalPrice: cartProductDto.quantity * foundProduct.price,
        },
      },
      {
        new: true,
        projection: this.generateCartProjection(QUERY_PARAM_DEFAULTS),
      },
    );
  }

  async handleRemoveProductFromCart(
    foundCart: Cart,
    foundProduct: Product,
    queryCartDto: QueryParamBaseDto,
  ): Promise<Cart> {
    return this.cartModel.findOneAndUpdate(
      {
        userId: foundCart.userId,
      },
      {
        $pull: {
          products: {
            productId: foundCart.products[0]?.productId,
          },
        },
        $inc: {
          totalProducts: -1 * foundCart.products[0]?.quantity,
          totalPrice: -1 * foundCart.products[0]?.quantity * foundProduct.price,
        },
      },
      {
        new: true,
        projection: this.generateCartProjection(queryCartDto),
      },
    );
  }

  async increaseOrDecreaseQuantity(
    foundCart: Cart,
    foundProduct: Product,
    updateQuantityDto: UpdateQuantityDto,
    queryCartDto: QueryParamBaseDto,
  ): Promise<Cart> {
    const weight = updateQuantityDto.type === UpdateQuantityType.INCREASE ? 1 : -1;
    foundCart = await this.cartModel.findOneAndUpdate(
      {
        userId: foundCart.userId,
        'products.productId': updateQuantityDto.productId,
      },
      {
        $inc: {
          'products.$.quantity': weight * updateQuantityDto.quantity,
          totalProducts: weight * updateQuantityDto.quantity,
          totalPrice: weight * updateQuantityDto.quantity * foundProduct.price,
        },
      },
      {
        new: true,
        projection: this.generateCartProjection(queryCartDto),
      },
    );

    return foundCart;
  }

  async populateCart(cart: Cart): Promise<Cart> {
    return cart.populate([
      {
        path: 'products.productId',
        select: 'name price images status slug',
      },
    ]);
  }

  generateCartProjection(queryCartDto: QueryParamBaseDto): ProjectionType<Cart> {
    return {
      products: {
        $slice: [queryCartDto.pageSize * queryCartDto.page, queryCartDto.pageSize * (queryCartDto.page + 1)],
      },
      status: 1,
      totalProducts: 1,
      totalPrice: 1,
    };
  }

  async findProduct(productId: string): Promise<Product> {
    const product = await this.productService.findOne({
      _id: productId,
    });

    if (!product) {
      throw new NotFoundException(ERROR.PRODUCT_NOT_FOUND.MESSAGE, ERROR.PRODUCT_NOT_FOUND.CODE);
    }

    return product;
  }

  async findCart(userId: string, productId: string): Promise<Cart> {
    let foundCart = await this.cartModel.findOne(
      {
        userId,
      },
      {
        products: productId
          ? {
              $elemMatch: {
                productId,
              },
            }
          : 0,
        userId: 1,
      },
    );

    if (!foundCart) {
      foundCart = await this.cartModel.create({
        products: [],
        userId,
        totalProducts: 0,
        totalPrice: 0,
      });
    }

    return foundCart;
  }

  async updateCart(updateCartDto: UpdateCartDto, userId: string): Promise<Cart> {
    const foundCart = await this.cartModel.findOne({
      userId,
    });

    if (!foundCart) {
      throw new BadRequestException(MessageConstants.CART_NOT_FOUND);
    }

    foundCart.status = updateCartDto.status;
    await foundCart.save();

    return foundCart;
  }

  async migrateCartSchema() {
    const carts = await this.cartModel.find();

    for (const cart of carts) {
      // Update each product in the cart
      for (const product of cart.products) {
        const _product: any = JSON.parse(JSON.stringify(product));
        if (_product['cartProduct']) {
          product.productId = new Types.ObjectId(_product.cartProduct) as any;
        }
      }

      // Recalculate totalProducts
      cart.totalProducts = cart.products.reduce((acc, product) => acc + product.quantity, 0);

      // Fetch product prices
      const productIds = cart.products.map(product => product.productId);
      const products = await this.productService.find({ _id: { $in: productIds } });

      // Recalculate totalPrice
      cart.totalPrice = cart.products.reduce((acc, currentProduct) => {
        const product = products.find(p => p._id.equals(currentProduct.productId as any));
        return acc + (product ? product.price * currentProduct.quantity : 0);
      }, 0);

      // Save the updated cart
      await cart.save();
    }

    return 'Migration completed successfully.';
  }

  async clearProductInCart(cartId: string): Promise<boolean> {
    const foundCart = await this.cartModel.findOne({
      _id: cartId,
    });

    if (!foundCart) {
      throw new BadRequestException(ERROR.CART_NOT_FOUND.MESSAGE, ERROR.CART_NOT_FOUND.CODE);
    }

    foundCart.products = [];
    foundCart.totalPrice = 0;
    foundCart.totalProducts = 0;
    await foundCart.save();

    return true;
  }
}
