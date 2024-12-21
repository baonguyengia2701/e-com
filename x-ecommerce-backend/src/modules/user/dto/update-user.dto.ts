import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
} from 'class-validator';
import { AccountType, UserStatus } from '../user.constant';

export class UpdateUserDto {
  @ApiProperty({
    description: 'first name',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'last name',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'email',
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({
    description: 'phone',
  })
  @IsOptional()
  @IsNumberString()
  @MinLength(8)
  @MaxLength(15)
  phone?: string;

  @ApiProperty({
    description: 'refresh token',
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiPropertyOptional({
    description: 'Account Type: DEFAULT, GOOGLE, FACEBOOK...',
  })
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType = AccountType.DEFAULT;

  @ApiPropertyOptional({
    description: 'User Status: VERIFIED, UNVERIFIED, DELETED',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus = UserStatus.UNVERIFIED;
}

export class UpdateProfileDto {
  @ApiProperty({
    description: 'first name',
  })
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'last name',
  })
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'email',
  })
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({
    description: 'imgUrl',
  })
  @IsString()
  @MaxLength(255)
  imgUrl?: string;

  @ApiPropertyOptional({
    description: 'phone',
  })
  @IsNumberString()
  @MinLength(8)
  @MaxLength(15)
  phone?: string;
}

export class ChangeUserPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class ChangeUserPasswordv2Dto extends ChangeUserPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  oldPassword: string;
}
