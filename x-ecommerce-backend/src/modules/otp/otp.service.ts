import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as OtpGenerator from 'otp-generator';
import { Otp } from './otp.entity';
import { COMMON_CONST } from '@/share/common/app.const';
import TimeUtils from '@/share/utils/time-utils';
import MessageConstants from '@/share/common/message.constants';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name)
    private readonly otpModel: Model<Otp>,
  ) {}

  async generateOtp(email: string): Promise<Otp> {
    const otpCode = OtpGenerator.generate(COMMON_CONST.OTP_LENGTH, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const expiredAt = new Date(new Date().getTime() + TimeUtils.convertLifespanToMilliseconds(process.env.OTP_EXPIRE));

    const newOtp = await this.otpModel.create({
      email,
      code: otpCode,
      expiredAt,
    });

    await newOtp.save();
    return newOtp;
  }

  async verifyOtp(otpCode: string): Promise<Otp> {
    const otp = await this.otpModel.findOne({
      code: otpCode,
      isUsed: false,
    });

    if (!otp) {
      throw new BadRequestException(MessageConstants.OTP_INVALID);
    }

    if (otp.expiredAt < new Date()) {
      throw new BadRequestException(MessageConstants.OTP_EXPIRED);
    }

    return otp;
  }

  async deactivateOtp(otp: Otp): Promise<boolean> {
    otp.isUsed = true;
    await otp.save();
    return true;
  }
}
