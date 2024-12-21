import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/guard/jwt-access-token.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { QueryParamDto } from './dto/query-param.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDocument } from './role.model';
import { IResponseList } from '@/share/common/app.interface';
import { API_CONFIG } from '@/configs/constant.config';
@UseGuards(JwtAccessTokenGuard)
@Controller({
  version: [API_CONFIG.VERSION_V1],
  path: 'roles',
})
@ApiTags('Role')
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  async create(@Body() roleDto: CreateRoleDto): Promise<RoleDocument> {
    return this.roleService.createRole(roleDto);
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RoleDocument> {
    return this.roleService.getRole(id);
  }
  @Get('')
  async getList(@Query() query: QueryParamDto): Promise<IResponseList<RoleDocument>> {
    return this.roleService.getListRole(query);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateRoleDto): Promise<RoleDocument> {
    return this.roleService.updateRole(id, updateDto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.roleService.deleteRole(id);
  }
}
