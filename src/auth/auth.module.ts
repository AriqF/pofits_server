import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt/dist';
import { HttpModule } from '@nestjs/axios';
import { JWTRefreshStrategy } from './jwt-refresh.strategy';
import { JWTStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { EmailModule } from 'src/email/email.module';
import { WeblogModule } from 'src/weblog/weblog.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
    JwtModule.register({
      secret: "pofits-secret",
      signOptions: {
        expiresIn: 3600
      }
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 30000,
        maxRedirects: 5,
      }),
    }),
    UserModule,
    EmailModule,
    WeblogModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTRefreshStrategy, JWTStrategy],
  exports: [AuthService]
})
export class AuthModule { }
