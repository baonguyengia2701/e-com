import { EmailerService } from '@/share/services/emailer.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [JwtModule.register({}), UserModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthService, EmailerService, LocalStrategy, JwtAccessTokenStrategy, GoogleStrategy],
  exports: [],
})
export class AuthModule {}
