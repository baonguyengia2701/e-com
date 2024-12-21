import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { COMMON_CONST } from '../common/app.const';

@Injectable()
export class PaginationQueryPipe implements PipeTransform {
  transform(value: any, _: ArgumentMetadata) {
    // Check if value is null or undefined and replace with default values
    value.page = value.page || COMMON_CONST.PAGE_NUMBER;
    if (value.page < 0) {
      throw new BadRequestException('Page index must be greater than or equal 0');
    }

    value.pageSize = value.pageSize || COMMON_CONST.PAGE_SIZE;

    const limit = Number(value.pageSize);
    const skip = value.page * limit;

    return { ...value, skip, limit };
  }
}
