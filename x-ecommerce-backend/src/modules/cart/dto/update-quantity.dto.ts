import { UpdateQuantityType } from '@/share/types/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CartProductDto } from './cart-product.dto';

export class UpdateQuantityDto extends CartProductDto {
  @ApiProperty({
    description: 'Type of update quantity action: INCREASE or DECREASE',
    example: 'xxx',
  })
  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(UpdateQuantityType)
  type: UpdateQuantityType;
}
