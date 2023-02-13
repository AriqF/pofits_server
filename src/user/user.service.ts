import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bc from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common/exceptions';
import { Role } from './interfaces/role.enum';
import { UserLoginDto } from 'src/auth/dto/user-login.dto';
import { UserRegisterDto } from 'src/auth/dto/user-register.dto';
import { WeblogService } from 'src/weblog/weblog.service';
import { LogType } from 'src/weblog/interfaces/log-type.enum';
import { UserFilterDto } from './dto/search-user.dto';
import { SetNewPasswordDto } from 'src/auth/dto/new-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

const thisModule = "User"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @Inject(forwardRef(() => WeblogService))
    private readonly logService: WeblogService,
  ) { }

  async signUp(registerDto: UserRegisterDto, isAdminRegis?: boolean): Promise<User> {
    const { username, email, password } = registerDto;

    const salt = await bc.genSalt();
    const hashedPassword = await bc.hash(password, salt);
    let user = this.userRepo.create({
      email, username,
      password: hashedPassword,
      role: isAdminRegis ? Role.Admin : Role.User,
    })

    try {
      user = await this.userRepo.save(user)
      delete user.password
      return user
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new ConflictException("Account already exists")
      } else if (error.code === "ER_NO_DEFAULT_FOR_FIELD") {
        throw new BadRequestException()
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async signIn(loginDto: UserLoginDto) {
    const user: User = await this.userRepo.findOne({
      where: {
        email: loginDto.email
      }
    })

    if (user && (await bc.compare(loginDto.password, user.password))) {
      if (user.status != 1) {
        throw new UnauthorizedException("User is inactive or is a deleted account")
      }
      delete user.password
      return user;
    } else if (user) {
      throw new UnauthorizedException("Email or password is incorrect");
    } else {
      throw new UnauthorizedException("Account does not exist")
    }
  }

  async updateIat(user: User, iat: number): Promise<boolean> {
    const updated: UpdateResult = await this.userRepo.update(user.id, {
      last_iat: iat
    });

    return updated.affected > 0;
  }

  queryGetUser(): SelectQueryBuilder<User> {
    const query = this.userRepo.createQueryBuilder('user')
      .select([
        'user.id', 'user.username', 'user.email', 'user.role', 'user.last_iat',
        'user.status', 'user.created_at', 'user.updated_at', 'user.deleted_at'
      ]);
    return query
  }

  async findAll(): Promise<User[]> {
    const users = await this.queryGetUser()
      .withDeleted()
      .orderBy('user.status', 'DESC')
      .getMany();
    if (users.length == 0) throw new NotFoundException("No user found");
    return users
  }

  async findAllByFilters(filterDto: UserFilterDto): Promise<User[]> {
    let { page, search, status } = filterDto;
    if (!page) page = 1;
    let users = this.queryGetUser()
      .withDeleted();

    if (search) {
      users.where('user.fullname LIKE :src OR user.email LIKE :src', { src: `%${search}%` })
    }

    if (status) users.andWhere('user.status = :sts', { sts: status })

    const filteredUsers = await users
      .take(15)
      .skip(15 * (page - 1))
      .orderBy('user.status', 'DESC')
      .getMany();

    if (filteredUsers.length == 0) throw new NotFoundException("No user match found")
    return filteredUsers
  }

  async findOne(id: number): Promise<User> {
    const user = await this.queryGetUser()
      .where('user.id = :uid', { uid: id })
      .withDeleted()
      .getOne();
    if (!user) throw new NotFoundException("No user found")
    return user
  }

  async getOneByEmail(email: string): Promise<User> {
    return await this.userRepo.findOne({
      where: { email }
    });
  }

  async getOneByID(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException("No user found by this ID");
    return user;
  }

  async getOneByResetToken(token: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { reset_token: token } })
    if (!user) throw new NotFoundException("No reset token was found")
    delete user.password
    return user
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto, ip: string) {
    try {
      await this.userRepo.update(id, {
        ...updateUserDto
      })
      await this.logService.addLog(`Updated user profile`, thisModule, LogType.Info, ip, id)
    } catch (error) {
      await this.logService.addLog(`Failed to update user profile: ${String(error)}`, thisModule, LogType.Info, ip, id)
      throw new InternalServerErrorException(String(error))
    }
    return { message: "Profile has been saved" }
  }

  async changeNewPassword(id: number, passwordDto: ChangePasswordDto, ip: string): Promise<Object> {
    const { old_password, password } = passwordDto;
    const user: User = await this.getOneByID(id);
    //confirm user auth
    if (await bc.compare(old_password, user.password)) {
      //confirm if last password used is same as the new one
      if (await bc.compare(password, user.password)) {
        throw new BadRequestException("New password cannot be the same as the old password")
      }
      try {
        await this.updatePassword(id, password);
        await this.logService.addLog("Updated password in profile setting", thisModule, LogType.Info, ip, id)
      } catch (error) {
        await this.logService.addLog(`Failed to update password in profile setting: ${String(error)}`, thisModule, LogType.Info, ip, id)
        throw new InternalServerErrorException("Failed to update password")
      }
      return { message: "Password change successfully" }
    }
  }

  async updatePassword(id: number, password: string): Promise<UpdateResult> {
    const salt = await bc.genSalt()
    const hashedPassword = await bc.hash(password, salt);
    const user: User = await this.userRepo.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException("No user found")
    try {
      const updated = await this.userRepo.update(id, {
        password: hashedPassword,
      });
      return updated;
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async updateResetToken(id: number, resetToken: string): Promise<UpdateResult> {
    const user: User = await this.userRepo.findOne({ where: { id: id } })
    if (!user) throw new NotFoundException("User not found")
    try {
      return await this.userRepo.update(id, { reset_token: resetToken })
    } catch (error) {
      await this.logService.addLog(`Failed to update reset token: ${String(error)}`, thisModule, LogType.Failure, "-", id)
    }
  }

  async deleteResetToken(id: number): Promise<UpdateResult> {
    const user: User = await this.userRepo.findOne({ where: { id: id } })
    if (!user) throw new NotFoundException("User not found")
    const update = await this.userRepo.update(id, {
      reset_token: ""
    });
    return update;
  }

  softDeleteById(id: number) {

  }

  restoreSoftDeleteById(id: number) {

  }

  hardDeleteById(id: number) {

  }
}
