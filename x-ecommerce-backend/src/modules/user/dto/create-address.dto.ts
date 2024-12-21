import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    description: 'Name',
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({
    description: 'Country',
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  country: string;

  @ApiProperty({
    description: 'City',
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  city: string;

  @ApiProperty({
    description: 'district',
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  district: string;

  @ApiProperty({
    description: 'ward',
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  ward: string;

  @ApiProperty({
    description: 'Specific Address',
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  @Transform(({ value }) => value.trim())
  specificAddress: string;

  @ApiProperty({
    description: 'Phone Number',
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  phoneNumber: number;

  @ApiProperty({
    description: 'Zip',
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  zip: string;

  @ApiProperty({
    description: 'Primary',
    example: 'true',
  })
  @IsNotEmpty()
  @IsBoolean()
  primary: boolean;
}
