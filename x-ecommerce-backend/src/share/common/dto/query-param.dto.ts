import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { COMMON_CONST } from '../app.const';

export class QueryParamBaseDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : COMMON_CONST.PAGE_NUMBER))
  @IsOptional()
  @IsNumber()
  page: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : COMMON_CONST.PAGE_SIZE))
  @IsOptional()
  @IsNumber()
  pageSize: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortBy: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsEnum(['desc', 'asc'])
  sortOrder: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  search: string;
}

export class ParamIdBaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  id: string;
}
