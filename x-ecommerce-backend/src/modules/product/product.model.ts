import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import slugify from 'slugify';
import { ProductStatus } from './product.constant';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
class Attribute {
  @Prop()
  k: string;

  @Prop()
  v: string;
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Product extends Document {
  @Prop({ length: 255, nullable: false })
  name: string;

  @Prop({ length: 255, nullable: false })
  slug: string;

  @Prop({ enum: ProductStatus, default: ProductStatus.PUBLISH })
  status: string;

  @Prop({ nullable: true })
  description: string;

  @Prop({})
  price: number;

  @Prop({})
  inventoryCount: number;

  @Prop({ type: [Attribute], default: [] })
  attributes: Attribute[];

  @Prop({ default: [] })
  images: string[];

  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('save', function (next) {
  // update slug when creating a new record or modified `name` field
  if (this.isNew || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + `-${Date.now()}`;
  }
  next();
});
