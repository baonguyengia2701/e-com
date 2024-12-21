import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email',
    example: 'test@gmail.com',
  })
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'password',
    example: '123qweA@',
  })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
