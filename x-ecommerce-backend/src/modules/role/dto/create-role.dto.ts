import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
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
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiPropertyOptional({
    description: 'code',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  code: string;
}
