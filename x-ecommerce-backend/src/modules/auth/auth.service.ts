import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { JwtPayload, TokenResponse } from 'src/modules/auth/auth.interface';

import { ERROR } from '@/share/common/error-code.const';
import MessageConstants from '@/share/common/message.constants';
import { EmailerService } from '@/share/services/emailer.service';
import BcryptUtils from '@/share/utils/bcrypt-utils';
import TimeUtils from '@/share/utils/time-utils';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AccountType, UserStatus } from '../user/user.constant';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyForgotPasswordDto } from './dto/verify-reset-password.dto';
import { OtpService } from '../otp/otp.service';
import CryptoUtils from '@/share/utils/crypto-utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailerService: EmailerService,
    private readonly otpSerivce: OtpService,
  ) {}

  async login(user: User): Promise<TokenResponse> {
    const payload: JwtPayload = {
      id: user._id,
      email: user.email,
    };
    const tokenResponse = this.generateTokenPairWithLifeSpans(payload);
    await this.updateRefreshToken(user._id, tokenResponse.refreshToken);

    return tokenResponse;
  }

  async googleLogin(req): Promise<User> {
    if (!req.user) {
      throw new Error('No user from google');
    }

    const existedUser = await this.userService.findOne({
      email: req.user?.email,
    });

    if (!existedUser) {
      const newUSer = await this.userService.create({
        email: req.user?.email,
        username: `${req.user?.lastName} ${req.user?.firstName}`,
        accountType: AccountType.GOOGLE,
      } as unknown as CreateUserDto);

      return newUSer;
    }

    return existedUser;
  }

  generateTokenPairWithLifeSpans(jwtPayload: JwtPayload): TokenResponse {
    const accessToken = this.jwtService.sign(jwtPayload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(jwtPayload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    return {
      accessToken,
      accessExpiresIn: TimeUtils.convertLifespanToMilliseconds(process.env.ACCESS_TOKEN_EXPIRES_IN),
      refreshToken,
      refreshExpiresIn: TimeUtils.convertLifespanToMilliseconds(process.env.REFRESH_TOKEN_EXPIRES_IN),
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<User> {
    const hashedRefreshToken: string = await BcryptUtils.hashData(refreshToken);
    return this.userService.updateUser(userId, { refreshToken: hashedRefreshToken });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne({ email: email }, 'name email password status phone');

    if (!user) {
      throw new BadRequestException(MessageConstants.EMAIL_IS_NOT_REGISTERED);
    }

    const checkHash = BcryptUtils.validateHashedContent(password, user.password);
    if (!checkHash) {
      throw new BadRequestException(MessageConstants.EMAIL_OR_PASSWORD_IS_INCORRECT);
    }

    return user;
  }

  async register(registerUserDto: RegisterDto): Promise<boolean> {
    const user = await this.userService.findOne({ email: registerUserDto.email });
    if (user) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE, ERROR.USER_EXISTED.CODE);
    }
    const hash = await BcryptUtils.hashData(registerUserDto.password);
    await this.userService.create({
      ...registerUserDto,
      password: hash,
      firstName: registerUserDto.firstName,
      lastName: registerUserDto.lastName,
      accountType: AccountType.DEFAULT,
      status: UserStatus.UNVERIFIED,
      phone: '',
      imgUrl: '',
    });
    return true;
  }

  async verifyResetPassword({ token, ...changePasswordDto }: VerifyForgotPasswordDto): Promise<boolean> {
    const decryptedOtp = CryptoUtils.decryptAES(token);
    const otp = await this.otpSerivce.verifyOtp(decryptedOtp);
    const user = await this.userService.findOne({
      email: otp.email,
    });

    if (!user) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND);
    }

    await this.userService.changePassword(user.email, changePasswordDto);
    await this.otpSerivce.deactivateOtp(otp);

    return true;
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<string> {
    const user = await this.userService.findOne({
      email: dto.email,
    });

    if (!user) {
      throw new BadRequestException(MessageConstants.EMAIL_IS_NOT_REGISTERED);
    }

    const otp = await this.otpSerivce.generateOtp(dto.email);

    const encryptedOtp = CryptoUtils.encryptAES(otp.code);

    await this.emailerService.sendPasswordResettingVerificationLink(
      `${user.lastName} ${user.firstName}`,
      dto,
      encryptedOtp,
    );

    return 'Send mail successfully';
  }

  async refreshToken(dto: RefreshTokenDto): Promise<TokenResponse> {
    const tokenDecode = this.verifyToken(dto.refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const payload: JwtPayload = {
      id: tokenDecode.id,
      email: tokenDecode.email,
    };

    const tokenResponse = this.generateTokenPairWithLifeSpans(payload);
    await this.updateRefreshToken(tokenDecode.id, tokenResponse.refreshToken);

    return tokenResponse;
  }

  verifyToken(token: string, privateKey: string): JwtPayload {
    // return token decoded
    try {
      const tokenDecoded = this.jwtService.verify(token, {
        secret: privateKey,
      });

      if (!tokenDecoded) {
        throw new UnauthorizedException(MessageConstants.TOKEN_INVALID);
      }

      return tokenDecoded;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(MessageConstants.TOKEN_EXPIRED);
      } else {
        throw new UnauthorizedException(MessageConstants.TOKEN_INVALID);
      }
    }
  }
}
