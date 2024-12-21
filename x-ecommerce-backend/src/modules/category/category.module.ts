import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './category.model';
import { CategoryController } from './category.controller';
import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
