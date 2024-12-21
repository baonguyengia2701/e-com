import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createHistoryDto } from './dto/create-history.dto';
import { History, HistoryDocument } from './history.model';
import { ERROR } from '@/share/common/error-code.const';
import { IPaginateParams, IResponseList } from '@/share/common/app.interface';

@Injectable()
export class HistoryService {
  constructor(@InjectModel(History.name) private readonly historyModel: Model<HistoryDocument>) {}

  async create(data: createHistoryDto): Promise<History> {
    if (!this.historyModel.findById(data.userId)) throw new NotFoundException(ERROR.USER_NOT_FOUND);
    return this.historyModel.create(data);
  }

  async getOne(id: string): Promise<History> {
    return this.historyModel.findById(id);
  }

  async getListHistory(params: IPaginateParams): Promise<IResponseList<History>> {
    const page = params.page > 0 ? Number(params.page) : 1;
    const pageSize = params.pageSize > 0 ? Number(params.pageSize) : 10;
    const conditions: any = {};
    let sortOption: any = {};

    if (params.search) conditions.name = { $regex: new RegExp(params.search, 'i') };
    if (params.status) conditions.status = params.status;
    if (params.sortBy) sortOption = { [params.sortBy]: params.sortOrder == 'desc' ? -1 : 1 };

    const results = await this.historyModel.aggregate([
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
    const totalPage = total % pageSize == 0 ? total / pageSize : Math.floor(total / pageSize) + 1;

    return {
      data,
      total,
      page,
      pageSize,
      totalPage,
    };
  }
}
