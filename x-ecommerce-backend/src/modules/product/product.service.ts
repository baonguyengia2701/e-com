import { IPaginateParams, IResponseList } from '@/share/common/app.interface';
import { ERROR } from '@/share/common/error-code.const';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './product.model';
import { ProductStatus } from './product.constant';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(data: CreateProductDto): Promise<ProductDocument> {
    const product = await this.productModel.create(data);
    return product.save();
  }

  async getProduct(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException(ERROR.PRODUCT_NOT_FOUND.MESSAGE, ERROR.PRODUCT_NOT_FOUND.CODE);
    }
    return product;
  }

  async getListProduct(params: IPaginateParams): Promise<IResponseList<ProductDocument>> {
    const page = params.page && params.page > 0 ? Number(params.page) : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? Number(params.pageSize) : 10;
    const conditions: any = {};
    let sortOption: any = {};
    if (params.search) {
      conditions.name = { $regex: new RegExp(params.search, 'i') };
    }
    if (params.status) {
      conditions.status = Number(params.status);
    } else {
      conditions.status = {
        $ne: ProductStatus.DELETED,
      };
    }

    if (params?.sortBy) {
      sortOption = {
        [params.sortBy]: params.sortOrder == 'desc' ? -1 : 1,
      };
    }

    const results = await this.productModel.aggregate([
      { $match: conditions },
      {
        $facet: {
          documents: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }, { $sort: sortOption }],
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
      page,
      pageSize,
      totalPage,
    };
  }

  async update(data: UpdateProductDto, id: string): Promise<ProductDocument> {
    const product = await this.productModel.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException(ERROR.PRODUCT_NOT_FOUND.MESSAGE, ERROR.PRODUCT_NOT_FOUND.CODE);
    }
    for (const [key, value] of Object.entries(data)) {
      product[key] = value;
    }
    return product.save();
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productModel.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException(ERROR.PRODUCT_NOT_FOUND.MESSAGE, ERROR.PRODUCT_NOT_FOUND.CODE);
    }
    product.isDeleted = true;
    await product.save();
    return product;
  }

  async migrateProductSchema(): Promise<boolean> {
    const products = await this.productModel.find();

    for (const product of products) {
      const _product = JSON.parse(JSON.stringify(product));
      if (_product.images && _product.images[0]) {
        product.images = [_product.images[0].s];
      } else {
        product.images = [];
      }

      // Save the updated product
      await product.save();
    }

    return true;
  }
  findOne: typeof this.productModel.findOne = this.productModel.findOne.bind(this.productModel);
  find: typeof this.productModel.find = this.productModel.find.bind(this.productModel);

  async checkProductExist(products: any[]): Promise<any> {
    return Promise.all(
      products.map(async product => {
        const foundProduct = await this.productModel.findOne({ _id: product.productId });
        if (foundProduct) {
          return {
            price: foundProduct.price,
            quantity: product.quantity,
            productId: foundProduct._id,
            name: foundProduct.name,
            images: foundProduct.images,
          };
        }
      }),
    );
  }

  async minusInventory({ productId, quantity }): Promise<boolean> {
    await this.productModel.updateOne(
      {
        _id: productId,
        inventoryCount: { $gte: quantity },
        status: ProductStatus.PUBLISH,
        isDeleted: false,
      },
      {
        $inc: { inventoryCount: -quantity },
      },
      { new: true },
    );

    return true;
  }
}
