import { IPaginateParams, IResponseList } from '@/share/common/app.interface';
import { ERROR } from '@/share/common/error-code.const';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.model';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) {}

  findOne: typeof this.categoryModel.findOne = this.categoryModel.findOne.bind(this.categoryModel);

  async getListCategory(params: IPaginateParams): Promise<IResponseList<CategoryDocument>> {
    const page = params.page && params.page > 0 ? Number(params.page) : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? Number(params.pageSize) : 100;
    const conditions: any = {};
    let sortOption: any = {};
    if (params.search) {
      conditions.name = { $regex: new RegExp(params.search, 'i') };
    }
    if (params?.sortBy) {
      sortOption = {
        [params.sortBy]: params.sortOrder == 'desc' ? -1 : 1,
      };
    }

    const results = await this.categoryModel.aggregate([
      {
        $facet: {
          documents: [
            { $match: conditions },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            { $sort: sortOption },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);
    const data = results[0].documents;
    const total = results[0].totalCount.length > 0 ? results[0].totalCount[0].count : 0;
    const totalPage = total % pageSize === 0 ? total / pageSize : Math.floor(total / pageSize) + 1;
    return {
      data,
      total,
      totalPage,
      page,
      pageSize,
    };
  }

  async createCategory(data: CreateCategoryDto): Promise<CategoryDocument> {
    const existingCategory = await this.categoryModel.findOne({ name: data.name });
    if (existingCategory) {
      throw new BadRequestException(ERROR.CATEGORY_NAME_EXISTED.MESSAGE, ERROR.CATEGORY_NAME_EXISTED.CODE);
    }
    const category = await this.categoryModel.create(data);
    return category.save();
  }

  async updateCategory(id: string, data: CreateCategoryDto): Promise<CategoryDocument> {
    const category = await this.categoryModel.findOneAndUpdate({ _id: id }, data, { new: true });
    if (!category) {
      throw new NotFoundException(ERROR.CATEGORY_NOT_FOUND.MESSAGE, ERROR.CATEGORY_NOT_FOUND.CODE);
    }
    return category;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const category = await this.categoryModel.findOne({ _id: id });
    if (!category) {
      throw new NotFoundException(ERROR.CATEGORY_NOT_FOUND.MESSAGE, ERROR.CATEGORY_NOT_FOUND.CODE);
    }
    await this.categoryModel.deleteOne({ _id: category._id });
    return true;
  }
}
