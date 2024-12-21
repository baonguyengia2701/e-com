import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../order.model';

export class OrderFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  pageSize: number = 10;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @Transform(({ value }) => value.trim())
  sortOrder: string = 'asc';
}
