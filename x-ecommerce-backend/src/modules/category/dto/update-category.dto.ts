import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'name',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiPropertyOptional({
    description: 'description',
  })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  description: string;

  @ApiPropertyOptional({
    description: 'imageUrl',
  })
  @IsOptional()
  imageUrl: string;
}
