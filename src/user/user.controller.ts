import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserFilterDto } from './dto/search-user.dto';
import { RealIP } from 'nestjs-real-ip';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from './entities/user.entity';
import { SetNewPasswordDto } from 'src/auth/dto/new-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from 'src/auth/role.decorator';
import { Role } from './interfaces/role.enum';
import { RolesGuard } from 'src/auth/role.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  getAllUsers(@Query() filterDto: UserFilterDto) {
    if (Object.keys(filterDto).length) {
      return this.userService.findAllByFilters(filterDto)
    } else {
      return this.userService.findAll()
    }
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getMyProfile(@GetUser() user: User) {
    return this.userService.findOne(user.id)
  }

  @Get("count")
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getCountActiveUsers() {
    return this.userService.getTotalUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  getOneUserById(@Param('id') userId: number) {
    return this.userService.findOne(userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  updateUserProfile(@GetUser() user: User, @Body() updateDto: UpdateUserDto, @RealIP() ip: string) {
    return this.userService.updateProfile(user.id, updateDto, ip)
  }


  @Patch('profile/password')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  updateUserPassword(@GetUser() user: User, @Body() passwordDto: ChangePasswordDto, @RealIP() ip: string) {
    return this.userService.changeNewPassword(user.id, passwordDto, ip)
  }

  @Patch('reset-default-password/:id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  resetToDefaultPassword(@GetUser() admin: User, @Param("id") userId: number, @RealIP() ip: string) {
    return this.userService.resetToDefaultPassword(userId, admin, ip)
  }

  @Delete('soft-delete/me')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  softDeleteMe(@GetUser() executant: User, @RealIP() ip: string) {
    return this.userService.softDeleteById(executant.id, executant, ip)
  }

  @Delete('soft-delete/:id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  softDeleteUser(@GetUser() executant: User, @Param('id') userId: number, @RealIP() ip: string) {
    return this.userService.softDeleteById(userId, executant, ip)
  }

  @Delete('hard-delete/:id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  hardDeleteUser(@GetUser() executant: User, @Param('id') userId: number, @RealIP() ip: string) {
    return this.userService.hardDeleteById(userId, executant, ip)
  }

}
