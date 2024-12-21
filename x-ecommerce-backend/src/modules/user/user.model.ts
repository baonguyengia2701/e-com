import { AccountType, UserStatus } from './user.constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Address } from './address.model';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User extends mongoose.Document {
  @Prop({ length: 255, unique: false, nullable: true })
  firstName: string;

  @Prop({ length: 255, unique: false, nullable: true })
  lastName: string;

  @Prop({ length: 255, unique: true, nullable: true })
  email: string;

  @Prop({ length: 200, nullable: true, select: false })
  password: string;

  @Prop({ enum: UserStatus, default: UserStatus.UNVERIFIED })
  status: UserStatus;

  @Prop({ length: 14, nullable: true })
  phone: string;

  @Prop({ length: 255, unique: false, nullable: true })
  imgUrl: string;

  @Prop({ enum: AccountType })
  accountType: AccountType;

  @Prop({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @Prop({ length: 1000, name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Prop({ type: [Address], default: [] })
  addresses: Address[];
}

export const UserSchema = SchemaFactory.createForClass(User);
