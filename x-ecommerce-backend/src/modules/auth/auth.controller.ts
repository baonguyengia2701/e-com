import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetUser } from '@/share/decorator/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.model';
import { TokenResponse } from './auth.interface';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyForgotPasswordDto } from './dto/verify-reset-password.dto';
import { JwtAccessTokenGuard } from './guard/jwt-access-token.guard';
import { LocalAuthGuard } from './guard/local.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() _: LoginDto, @GetUser() user: User): Promise<TokenResponse> {
    return this.authService.login(user);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<boolean> {
    return this.authService.register(registerDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAccessTokenGuard)
  @Get('profile')
  getProfile(@GetUser() user: User): Partial<User> {
    return {
      _id: user._id,
      email: user.email,
      status: user.status,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    };
  }

  @Post('forgot-password/reset-password')
  verifyResetPassword(@Body() verifyForgotPasswordDto: VerifyForgotPasswordDto): Promise<boolean> {
    return this.authService.verifyResetPassword(verifyForgotPasswordDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<string> {
    return this.authService.forgotPassword(dto);
  }

  @Post('refresh-token')
  async refreshAccessToken(@Body() dto: RefreshTokenDto): Promise<TokenResponse> {
    return this.authService.refreshToken(dto);
  }
}
