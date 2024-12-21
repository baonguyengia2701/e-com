import { ApiImage } from '@/share/decorator/api-image.decorator';
import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/guard/jwt-access-token.guard';
import { FileResponse } from './image.interface';

@ApiBearerAuth()
@Controller('images')
@UseGuards(JwtAccessTokenGuard)
@ApiTags('Image')
export class ImageController {
  constructor() {}

  @Post('upload')
  @ApiImage()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() image: Express.Multer.File): Promise<FileResponse> {
    if (!image) throw new BadRequestException('No image uploaded');
    const { mimetype, filename, originalname, size } = image;

    return {
      path: `/images/${filename}`,
      mimetype,
      originalname,
      size,
    };
  }
}
