import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ProductStatus } from '../product.constant';
import { Attribute } from '../product.interface';

export class CreateProductDto {
  @ApiProperty({
    description: 'name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  name: string;

  // @ApiProperty({
  //   description: 'slug',
  // })
  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(255)
  // slug: string;

  @ApiProperty({
    description: 'status',
  })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiPropertyOptional({
    description: 'description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiPropertyOptional({
    description: 'price',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiPropertyOptional({
    description: 'inventoryCount',
  })
  @IsOptional()
  @IsInt()
  inventoryCount: number;

  @ApiPropertyOptional({
    description: 'attributes',
  })
  @IsOptional()
  attributes: Attribute[];

  @ApiPropertyOptional({
    description: 'images',
  })
  @IsOptional()
  images: string[];
}
