import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../user/user.model';

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
  PENDING = 'pending', // dang duoc xu li
  CONFIRMED = 'confirmed', // duoc confirm boi he thong
  SHIPPED = 'shipped', // duoc dua den tay nguoi dung
  CANCELLED = 'cancelled', // bi huy
}

class CheckoutInfo {
  @Prop({ type: Number, required: true })
  totalPrice: number;

  // Currency, discount, ......
}

class ShippingInfo {
  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type: String, required: false })
  phone: string;

  @Prop({ type: String, required: false })
  city: string;

  @Prop({ type: String, required: false })
  district: string;

  @Prop({ type: String, required: false })
  street: string;

  @Prop({ type: String, required: false })
  ward: string;

  @Prop({ type: String, required: false })
  note: string;
}

class PaymentInfo {
  @Prop({ type: String, required: false })
  method: string;

  @Prop({ type: String, required: false })
  cardNumber: string;

  @Prop({ type: String, required: false })
  holderName: string;

  @Prop({ type: Date, required: false })
  expiredDate: Date;
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Order {
  @Prop({ type: Types.ObjectId, ref: User.name, required: false, nullable: true })
  userId: Types.ObjectId;

  @Prop({ type: CheckoutInfo, nullable: true, default: {} })
  checkoutInfo: CheckoutInfo;

  @Prop({ type: ShippingInfo, nullable: true, default: {} })
  shippingInfo: ShippingInfo;

  @Prop({ type: PaymentInfo, nullable: true, default: {} })
  paymentInfo: PaymentInfo;

  @Prop({ type: Array, required: true, nullable: false, default: [] })
  productInfo: [];

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
