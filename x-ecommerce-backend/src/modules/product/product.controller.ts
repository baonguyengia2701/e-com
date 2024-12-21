import { API_CONFIG } from '@/configs/constant.config';
import { IResponseList } from '@/share/common/app.interface';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/guard/jwt-access-token.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryParamDto } from './dto/query-param.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './product.model';
import { ProductService } from './product.service';
import { Public } from '@/share/decorator/public.decorator';

@Controller({
  version: [API_CONFIG.VERSION_V1],
  path: 'products',
})
@UseGuards(JwtAccessTokenGuard)
@ApiTags('Product')
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() data: CreateProductDto): Promise<ProductDocument> {
    return this.productService.create(data);
  }

  @Public()
  @Get(':id')
  getProduct(@Param('id') id: string): Promise<ProductDocument> {
    return this.productService.getProduct(id);
  }

  @Public()
  @Get()
  async getListProduct(@Query() query: QueryParamDto): Promise<IResponseList<ProductDocument>> {
    return this.productService.getListProduct(query);
  }

  @Patch(':id')
  @HttpCode(204)
  updateProduct(@Param('id') id: string, @Body() data: UpdateProductDto): Promise<ProductDocument> {
    return this.productService.update(data, id);
  }

  @Delete(':id')
  @HttpCode(204)
  async removeProduct(@Param('id') id: string): Promise<Product> {
    return this.productService.remove(id);
  }

  @Post('migrate-old-schema')
  async migrateOldSchema(): Promise<void> {
    await this.productService.migrateProductSchema();
    return;
  }
}
