import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Address extends mongoose.Document {
  @Prop()
  name: string;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  district: string;

  @Prop()
  ward: string;

  @Prop()
  specificAddress: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  zip: string;

  @Prop()
  primary: boolean;

  @Prop()
  userid: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
