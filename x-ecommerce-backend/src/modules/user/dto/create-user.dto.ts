import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AccountType, UserStatus } from '../user.constant';
import { Optional } from '@nestjs/common';

export class CreateUserDto {
  @ApiProperty({
    description: 'First name',
  })
  @Optional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  firstName: string;

  @ApiProperty({
    description: 'Last name',
  })
  @Optional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  lastName: string;

  @ApiProperty({
    description: 'email',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiPropertyOptional({
    description: 'password',
  })
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    description: 'phone',
  })
  @IsOptional()
  @IsNumberString()
  @MinLength(8)
  @MaxLength(15)
  phone: string;

  @ApiPropertyOptional({
    description: 'imgUrl',
  })
  @IsString()
  @MaxLength(255)
  imgUrl?: string;

  @ApiPropertyOptional({
    description: 'Account Type: DEFAULT, GOOGLE, FACEBOOK...',
  })
  @IsOptional()
  @IsEnum(AccountType)
  accountType: AccountType = AccountType.DEFAULT;

  @ApiPropertyOptional({
    description: 'User Status: VERIFIED, UNVERIFIED, DELETED',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus = UserStatus.UNVERIFIED;
}
