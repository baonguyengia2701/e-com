import { Module } from '@nestjs/common';
import { Otp, OtpSchema } from './otp.entity';
import { OtpService } from './otp.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
