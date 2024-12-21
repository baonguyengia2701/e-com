import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QueryParamDto {
  @ApiPropertyOptional()
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  pageSize: number = 100;

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
}
