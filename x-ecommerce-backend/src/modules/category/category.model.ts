import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Category {
  @Prop({ length: 255, unique: true, nullable: false })
  name: string;

  @Prop({ nullable: true })
  description: string;

  @Prop({ nullable: true })
  imageUrl: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
