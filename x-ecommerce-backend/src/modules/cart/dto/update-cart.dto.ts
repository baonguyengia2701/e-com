import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CartStatus } from '../cart.model';

export class UpdateCartDto {
  @ApiProperty({
    description: 'Cart Status',
    example: CartStatus.DEACTIVE,
  })
  @IsEnum(CartStatus)
  status: CartStatus;
}
