import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImageController } from './image.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        limits: {
          fileSize: 1024 * 1024 * parseInt(process.env.MAX_FILE_SIZE),
        },
        storage: diskStorage({
          filename: (req, file, callback) => {
            let name = file.originalname.split('.').slice(0, -1).join('.'); // remove extension of the file
            name = name.split(/\s+/).join('-'); // remove space between words in name
            const fileExtName = extname(file.originalname);
            callback(null, `${name}_${Date.now()}${fileExtName}`);
          },
          destination: (req, file, cb) => {
            const uploadPath = process.env.IMAGE_UPLOAD_DIR;

            cb(null, `./${uploadPath}/images`);
          },
        }),
      }),
    }),
  ],
  controllers: [ImageController],
  providers: [],
})
export class ImageModule {}
