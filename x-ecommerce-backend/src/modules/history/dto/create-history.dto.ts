import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { HistoryType } from '../history.constants';

export class createHistoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(HistoryType)
  type: HistoryType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  detail?: Record<string, any>;
}
