import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterDto } from './dto/signup.dto';
import * as bc from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common/exceptions';
import { Role } from './entities/role.enum';
import { UserLoginDto } from 'src/auth/dto/user-login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
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
        'user.created_at', 'user.updated_at', 'user.deleted_at'
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

  async findOne(id: number) {
    const user = await this.queryGetUser()
      .where('user.id = :uid', { uid: id })
      .withDeleted()
      .getOne();
    if (!user) throw new NotFoundException("No user found")
    return user
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto, ip: string) {
    //*nyoba gak perlu di search usernya diawal apa bisa?
    try {
      await this.userRepo.update(id, {
        ...updateUserDto
      })

      //*add log success
    } catch (error) {
      //*add log failed
      throw new InternalServerErrorException(String(error))
    }
    return { message: "Profile has been saved" }
  }

  softDeleteById(id: number) {

  }

  restoreSoftDeleteById(id: number) {

  }

  hardDeleteById(id: number) {

  }
}
