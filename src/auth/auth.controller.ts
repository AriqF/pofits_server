import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { RealIp } from 'nestjs-real-ip';
import { UserRegisterDto } from './dto/user-register.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { RequestResetDto } from './dto/req-reset.dto';
import { SetNewPasswordDto } from './dto/new-password.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UsePipes(new ValidationPipe())
  userLogin(@Body() loginDto: UserLoginDto, @RealIp() ip: string) {
    return this.authService.signIn(loginDto, ip)
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  userRegister(@Body() regisDto: UserRegisterDto, @RealIp() ip: string) {
    return this.authService.signUp(regisDto, ip, false)
  }

  @Post('admin/register')
  @UsePipes(new ValidationPipe())
  adminRegister(@Body() regisDto: UserRegisterDto, @RealIp() ip: string) {
    return this.authService.signUp(regisDto, ip, true)
  }

  @UseGuards(AuthGuard('jwt-refreshtoken'))
  @Post('refreshtoken')
  refreshToken(@GetUser() user: User) {
    return this.authService.refreshToken(user)
  }

  @Post('forgot-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  forgotPassword(@Body() requestResDto: RequestResetDto, @RealIp() ip: string) {
    return this.authService.requestResetPassword(requestResDto, ip)
  }

  @Patch('setup-password/:reset_token')
  @UsePipes(new ValidationPipe({ transform: true }))
  setupNewPassword(@Body() changeDto: SetNewPasswordDto, @RealIp() ip: string, @Param('reset_token') resetToken: string) {
    return this.authService.setupNewPasswordMail(changeDto, resetToken, ip)
  }
}
