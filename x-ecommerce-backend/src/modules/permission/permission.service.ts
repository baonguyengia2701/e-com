import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './permission.model';
import { Model } from 'mongoose';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ERROR } from '@/share/common/error-code.const';
import { IPaginateParams, IResponseList } from '@/share/common/app.interface';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async createPermission(data: CreatePermissionDto): Promise<PermissionDocument> {
    const permission = await this.permissionModel.create(data);
    return permission.save();
  }

  async getPermission(id: string): Promise<PermissionDocument> {
    const permission = await this.permissionModel.findOne({ _id: id });
    return permission;
  }

  async deletePermission(id: string): Promise<boolean> {
    const permission = await this.permissionModel.findOne({ _id: id });
    if (!permission) {
      throw new NotFoundException(ERROR.PERMISSION_NOT_FOUND.MESSAGE, ERROR.PERMISSION_NOT_FOUND.CODE);
    }
    await this.permissionModel.deleteOne({ _id: id });

    return true;
  }
  async updatePermission(id: string, data: CreatePermissionDto): Promise<PermissionDocument> {
    const permission = await this.permissionModel.findOne({ _id: id });
    if (!permission) {
      throw new NotFoundException(ERROR.PERMISSION_NOT_FOUND.MESSAGE, ERROR.PERMISSION_NOT_FOUND.CODE);
    }
    permission.set(data);
    return permission.save();
  }
  async getListPermission(params: IPaginateParams): Promise<IResponseList<PermissionDocument>> {
    const page = params.page && params.page > 0 ? Number(params.page) : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? Number(params.pageSize) : 10;
    const conditions: any = {};
    let sortOption: any = {};
    if (params.search) {
      conditions.name = { $regex: new RegExp(params.search, 'i') };
    }
    if (params.status) {
      conditions.status = Number(params.status);
    }

    if (params?.sortBy) {
      sortOption = {
        [params.sortBy]: params.sortOrder == 'desc' ? -1 : 1,
      };
    }

    const results = await this.permissionModel.aggregate([
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
      page,
      pageSize,
      totalPage,
    };
  }
}
