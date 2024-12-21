import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CartProductDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'xxx',
  })
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsMongoId()
  productId: string;

  @ApiProperty({
    description: 'Quantity',
    example: '2',
  })
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Quantity must be number' })
  @Min(1, { message: 'Quantity must be positive' })
  @IsOptional()
  quantity: number;
}
