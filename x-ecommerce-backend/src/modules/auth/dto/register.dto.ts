import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email',
    example: 'test@gmail.com',
  })
  @Transform(({ value }) => value?.trim())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Nguyen',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'First name',
    example: 'A',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Password',
    example: '123qweA@',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  password: string;
}
