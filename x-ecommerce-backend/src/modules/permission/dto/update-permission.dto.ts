import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePermissionDto {
  @ApiProperty({
    description: 'code',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  code: string;
  @ApiPropertyOptional({
    description: 'isDeleted',
  })
  @IsOptional()
  isDeleted: boolean;

  @ApiPropertyOptional({
    description: 'description',
  })
  @IsString()
  @MaxLength(500)
  description: string;
}
