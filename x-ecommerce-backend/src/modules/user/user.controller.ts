import { IResponseList } from '@/share/common/app.interface';
import { Body, Controller, Get, Param, Post, Query, UseGuards, Put, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_CONFIG } from '../../configs/constant.config';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryParamDto } from './dto/query-param.dto';
import { User } from './user.model';
import { UserService } from './user.service';
import { ChangeUserPasswordv2Dto, UpdateProfileDto } from './dto/update-user.dto';
import { GetUser } from '@/share/decorator/get-user.decorator';
import { JwtAccessTokenGuard } from '../auth/guard/jwt-access-token.guard';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './address.model';

@Controller({
  version: [API_CONFIG.VERSION_V1],
  path: 'users',
})
@ApiTags('User')
@UseGuards(JwtAccessTokenGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.create(body);
  }

  @Get('profile')
  async getUser(@GetUser() user: User): Promise<User> {
    return this.userService.getUser(user._id);
  }

  @Put('profile')
  async changeInforUser(@Body() body: UpdateProfileDto, @GetUser() user: User): Promise<User> {
    return this.userService.updateProfile(user._id, body);
  }

  @Get()
  async getListUser(@Query() query: QueryParamDto): Promise<IResponseList<User>> {
    return this.userService.getListUser(query);
  }

  @Post('change-password')
  async changePassword(@Body() dto: ChangeUserPasswordv2Dto, @GetUser() user: User): Promise<boolean> {
    return this.userService.changepasswordv2(user.id, dto);
  }

  @Get('/address')
  async getAddress(@GetUser() user: User): Promise<Address[]> {
    return this.userService.getAddress(user._id);
  }
  @Get('/address/:addressId')
  async getAddressById(@Param('addressId') addressId: string, @GetUser() user: User): Promise<Address> {
    return this.userService.getAddressById(user._id, addressId);
  }

  @Post('/address')
  async addAddress(@Body() body: CreateAddressDto, @GetUser() user: User): Promise<Address[]> {
    return this.userService.addAddress(user._id, body);
  }

  @Put('/address/:addressId')
  async updateAddress(
    @Param('addressId') addressId: string,
    @Body() address: CreateAddressDto,
    @GetUser() user: User,
  ): Promise<Address> {
    return this.userService.updateAddress(user._id, addressId, address);
  }

  @Delete(':id/address/:addressId')
  async deleteAddress(@Param('addressId') addressId: string, @GetUser() user: User): Promise<boolean> {
    return this.userService.deleteAddress(user._id, addressId);
  }
}
