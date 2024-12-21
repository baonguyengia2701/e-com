import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import appConfig from './configs/server.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  appConfig(app);

  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  await app.listen(configService.get<number>('PORT') || 8000);
}

bootstrap();
