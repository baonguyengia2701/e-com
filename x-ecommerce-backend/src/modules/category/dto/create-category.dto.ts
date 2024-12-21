import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'name',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({
    description: 'description',
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  description: string;

  @ApiProperty({
    description: 'imageUrl',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  imageUrl: string;
}
