import { API_CONFIG } from '@/configs/constant.config';
import { IResponseList } from '@/share/common/app.interface';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryDocument } from './category.model';
import { CategoryService } from './category.service';
import { QueryParamDto } from './dto/query-param.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAccessTokenGuard } from '../auth/guard/jwt-access-token.guard';
import { Public } from '@/share/decorator/public.decorator';

@UseGuards(JwtAccessTokenGuard)
@Controller({
  version: [API_CONFIG.VERSION_V1],
  path: 'categories',
})
@ApiTags('Category')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  async getListCategory(@Query() query: QueryParamDto): Promise<IResponseList<CategoryDocument>> {
    return this.categoryService.getListCategory(query);
  }

  @Post()
  async createCategory(@Body() body: CreateCategoryDto): Promise<CategoryDocument> {
    return this.categoryService.createCategory(body);
  }

  @Put(':id')
  async updateCategory(@Body() body: UpdateCategoryDto, @Param('id') id: string): Promise<CategoryDocument> {
    return this.categoryService.updateCategory(id, body);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<boolean> {
    return this.categoryService.deleteCategory(id);
  }
}
