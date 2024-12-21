import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token for verification',
    example: 'xxx',
  })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}
