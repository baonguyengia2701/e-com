import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email to receive confirmation information',
    example: 'test@gmail.com',
  })
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
