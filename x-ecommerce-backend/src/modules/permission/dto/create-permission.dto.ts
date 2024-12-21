import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'code',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  code: string;

  @ApiPropertyOptional({
    description: 'description',
  })
  @IsString()
  @MaxLength(500)
  description: string;
}
