import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './role.model';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR } from '@/share/common/error-code.const';
import { IPaginateParams, IResponseList } from '@/share/common/app.interface';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async createRole(data: CreateRoleDto): Promise<RoleDocument> {
    const role = await this.roleModel.create(data);
    return role.save();
  }

  async getRole(id: string): Promise<RoleDocument> {
    const role = await this.roleModel.findOne({ _id: id });
    if (!role) {
      throw new NotFoundException(ERROR.ROLE_NOT_FOUND.MESSAGE, ERROR.ROLE_NOT_FOUND.CODE);
    }
    return role;
  }

  async deleteRole(id: string): Promise<boolean> {
    const role = await this.roleModel.findOne({ _id: id });
    if (!role) {
      throw new NotFoundException(ERROR.ROLE_NOT_FOUND.MESSAGE, ERROR.ROLE_NOT_FOUND.CODE);
    }
    await this.roleModel.deleteOne({ _id: id });

    return true;
  }
  async updateRole(id: string, data: CreateRoleDto): Promise<RoleDocument> {
    const role = await this.roleModel.findOne({ _id: id });
    if (!role) {
      throw new NotFoundException(ERROR.ROLE_NOT_FOUND.MESSAGE, ERROR.ROLE_NOT_FOUND.CODE);
    }
    role.set(data);
    return role.save();
  }
  async getListRole(params: IPaginateParams): Promise<IResponseList<RoleDocument>> {
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

    const results = await this.roleModel.aggregate([
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
