import { User } from '@/modules/user/user.model';
import MessageConstants from '@/share/common/message.constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';
import { JwtPayload } from '../auth.interface';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    try {
      const user = await this.userService.findOne({ _id: payload.id, refreshToken: { $ne: null } });
      if (!user) throw new UnauthorizedException(MessageConstants.TOKEN_INVALID);
      return user;
    } catch (error) {
      throw new UnauthorizedException(MessageConstants.TOKEN_INVALID);
    }
  }
}
