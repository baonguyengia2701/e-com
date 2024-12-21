import { API_CONFIG } from '@/configs/constant.config';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { JwtAccessTokenGuard } from '../auth/guard/jwt-access-token.guard';
import { IResponseList } from '@/share/common/app.interface';
import { QueryParamDto } from './dto/query-param.dto';
import { History } from './history.model';

@UseGuards(JwtAccessTokenGuard)
@Controller({
  version: [API_CONFIG.VERSION_V1],
  path: 'histories',
})
@ApiTags('History')
@ApiBearerAuth()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':id')
  async getHistory(@Param('id') id: string): Promise<History> {
    return this.historyService.getOne(id);
  }

  @Get()
  async getListHistory(@Query() query: QueryParamDto): Promise<IResponseList<History>> {
    return this.historyService.getListHistory(query);
  }
}
