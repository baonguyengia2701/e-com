import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';
import { CartProductDto } from './dto/cart-product.dto';

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  DEACTIVE = 'DEACTIVE',
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Cart extends mongoose.Document {
  @Prop({
    type: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: Product.name },
        quantity: Number,
      },
    ],
  })
  products: CartProductDto[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  @Prop({
    type: Number,
    default: 0,
  })
  totalProducts: number;

  @Prop({
    type: Number,
    default: 0,
  })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('products')) {
    this.totalProducts = this.products.reduce(
      (accumulator, currentProduct) => (accumulator += currentProduct.quantity),
      0,
    );
  }
  next();
});
