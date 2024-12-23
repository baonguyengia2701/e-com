import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsMongoId, IsNotEmpty, IsEnum } from 'class-validator';
import { ProductStatus } from '../product.constant';

export class QueryParamDto {
  @ApiPropertyOptional()
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  pageSize: number = 10;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  sortBy: string = 'createdAt';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsEnum(['desc', 'asc'])
  @Transform(({ value }) => value.trim())
  sortOrder: string = 'asc';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ProductStatus)
  @Transform(({ value }) => value.trim())
  status: ProductStatus;
}

export class ParamIdDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  id: string;
}
