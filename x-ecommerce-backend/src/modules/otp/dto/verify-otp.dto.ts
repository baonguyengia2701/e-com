import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'OTP including 6 digitals is sent to your email',
    example: 'xxxxxx',
  })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'OTP is required' })
  otpCode: string;
}
VerifyOtpDto;
