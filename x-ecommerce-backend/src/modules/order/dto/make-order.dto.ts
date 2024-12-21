import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class ShippingInfo {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  district: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  ward: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  note: string;
}

export class PaymentInfo {
  @ApiProperty()
  @IsOptional()
  @IsString()
  method: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cardNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  holderName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  expiredDate: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cvv: string;
}

export class MakeOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cartId: string;

  @ApiProperty()
  @IsObject()
  @Type(() => ShippingInfo)
  shippingInfo: ShippingInfo;

  @ApiProperty()
  @IsObject()
  @Type(() => PaymentInfo)
  paymentInfo: PaymentInfo;
}
