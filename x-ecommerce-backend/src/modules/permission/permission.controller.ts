import { API_CONFIG } from '@/configs/constant.config';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from '../auth/guard/jwt-access-token.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionDocument } from './permission.model';
import { QueryParamDto } from './dto/query-param.dto';
import { IResponseList } from '@/share/common/app.interface';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@UseGuards(JwtAccessTokenGuard)
@Controller({
  version: [API_CONFIG.VERSION_V1],
  path: 'permissions',
})
@ApiTags('Permission')
@ApiBearerAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() permissionDto: CreatePermissionDto): Promise<PermissionDocument> {
    return this.permissionService.createPermission(permissionDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PermissionDocument> {
    return this.permissionService.getPermission(id);
  }
  @Get('')
  async getList(@Query() query: QueryParamDto): Promise<IResponseList<PermissionDocument>> {
    return this.permissionService.getListPermission(query);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdatePermissionDto): Promise<PermissionDocument> {
    return this.permissionService.updatePermission(id, updateDto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.permissionService.deletePermission(id);
  }
}
