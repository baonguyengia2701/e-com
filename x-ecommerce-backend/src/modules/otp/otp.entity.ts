import { COMMON_CONST } from '@/share/common/app.const';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Otp extends Document {
  id: string;

  @Prop({ length: 100 })
  email: string;

  @Prop({ length: COMMON_CONST.OTP_LENGTH })
  code: string;

  @Prop({
    type: Date,
    name: 'expired_at',
  })
  expiredAt: Date;

  @Prop({ type: Boolean, name: 'is_used', default: false })
  isUsed?: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
