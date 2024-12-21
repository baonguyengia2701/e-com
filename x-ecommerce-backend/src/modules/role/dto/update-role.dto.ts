import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiPropertyOptional({
    description: 'description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiPropertyOptional({
    description: 'code',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  code: string;
  @ApiPropertyOptional({
    description: 'isDeleted',
  })
  @IsOptional()
  isDeleted: boolean;
}
