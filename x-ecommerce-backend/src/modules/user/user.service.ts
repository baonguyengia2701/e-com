import { IPaginateParams, IResponseList } from '@/share/common/app.interface';
import { ERROR } from '@/share/common/error-code.const';
import MessageConstants from '@/share/common/message.constants';
import BcryptUtils from '@/share/utils/bcrypt-utils';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangeUserPasswordDto, ChangeUserPasswordv2Dto, UpdateUserDto, UpdateProfileDto } from './dto/update-user.dto';
import { User } from './user.model';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './address.model';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<Address>,
  ) {}

  findOne: typeof this.userModel.findOne = this.userModel.findOne.bind(this.userModel);

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.userModel.findOne({ email: data.email });
    if (user) {
      throw new BadRequestException(ERROR.COMMON_BAD_REQUEST, 'Email already exists');
    }
    return this.userModel.create(data);
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE, ERROR.USER_NOT_FOUND.CODE);
    }
    return user;
  }

  async getListUser(params: IPaginateParams): Promise<IResponseList<User>> {
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

    const results = await this.userModel.aggregate([
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

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE, ERROR.USER_NOT_FOUND.CODE);
    }
    return user.updateOne(data);
  }

  async updateProfile(id: string, data: UpdateProfileDto): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE, ERROR.USER_NOT_FOUND.CODE);
    }
    return user.updateOne(data);
  }

  async changePassword(email: string, changePasswordDto: ChangeUserPasswordDto): Promise<boolean> {
    const user = await this.findOne({
      email,
    }).select('+password'); // Select password field

    if (!user) {
      throw new UnauthorizedException(MessageConstants.EMAIL_IS_NOT_REGISTERED);
    }

    const hashedPassword = await BcryptUtils.hashData(changePasswordDto.newPassword); // Hash new password
    user.password = hashedPassword; // Update new password

    await user.save(); // Save new password
    return true;
  }

  async changepasswordv2(id: string, changePasswordDto: ChangeUserPasswordv2Dto): Promise<boolean> {
    const user = await this.userModel.findOne({ _id: id }).select('+password');
    if (!user) throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE, ERROR.USER_NOT_FOUND.CODE);
    const isMatch = await BcryptUtils.comparehash(changePasswordDto.oldPassword, user.password);
    if (!isMatch) throw new BadRequestException(MessageConstants.OLD_PASSWORD_WRONG);
    const hashedPassword = await BcryptUtils.hashData(changePasswordDto.newPassword);
    user.password = hashedPassword;

    await user.save();
    return true;
  }

  async getAddress(id: string): Promise<Address[]> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE, ERROR.USER_NOT_FOUND.CODE);
    }
    return user.addresses;
  }

  async addAddress(id: string, address: CreateAddressDto): Promise<Address[]> {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE, ERROR.USER_NOT_FOUND.CODE);
    }

    if (address.primary) {
      await this.addressModel.updateMany({ userid: id, primary: true }, { $set: { primary: false } });

      user.addresses.forEach(address => {
        if (address.primary) address.primary = false;
      });
    }

    const newAddress = new this.addressModel(address);
    newAddress.userid = id;
    const savedAddress = await newAddress.save();
    user.addresses.push(savedAddress);
    await user.save();
    const updatedUser = await this.userModel.findOne({ _id: id });
    return updatedUser.addresses;
  }

  async getAddressById(id: string, addressId: string): Promise<Address> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE, ERROR.USER_NOT_FOUND.CODE);
    }
    const address = await this.addressModel.findOne({ _id: addressId });
    if (!address) {
      throw new NotFoundException(ERROR.ADDRESS_NOT_FOUND.MESSAGE, ERROR.ADDRESS_NOT_FOUND.CODE);
    }
    return address;
  }

  async updateAddress(id: string, addressId: string, address: CreateAddressDto): Promise<Address> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE, ERROR.USER_NOT_FOUND.CODE);
    }

    if (address.primary) {
      await this.addressModel.updateMany({ _id: { $ne: addressId }, userid: id }, { $set: { primary: false } });

      user.addresses.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.primary = false;
        }
      });
    }

    const updatedAddress = await this.addressModel.findOneAndUpdate({ _id: addressId }, address, { new: true });

    if (!updatedAddress) {
      throw new NotFoundException(ERROR.ADDRESS_NOT_FOUND.MESSAGE, ERROR.ADDRESS_NOT_FOUND.CODE);
    }
    // Cập nhật mảng address của user
    const addressIndex = user.addresses.findIndex(itemAddress => {
      return itemAddress._id.toString() === addressId;
    });
    if (addressIndex !== -1) {
      user.addresses[addressIndex] = updatedAddress;
      await user.save();
    }

    return updatedAddress;
  }

  async deleteAddress(id: string, addressId: string): Promise<boolean> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE, ERROR.USER_NOT_FOUND.CODE);
    }
    const address = await this.addressModel.findOne({ _id: addressId });
    if (!address) {
      throw new NotFoundException(ERROR.ADDRESS_NOT_FOUND.MESSAGE, ERROR.ADDRESS_NOT_FOUND.CODE);
    }
    await this.addressModel.deleteOne({ _id: addressId });
    const addressIndex = user.addresses.findIndex(itemAddress => {
      return itemAddress._id.toString() === addressId;
    });
    if (addressIndex !== -1) {
      user.addresses.splice(addressIndex, 1);
      await user.save();
    }
    return true;
  }
}
