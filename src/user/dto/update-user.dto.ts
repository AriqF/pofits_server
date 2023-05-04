import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(256)
    @MinLength(2)
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(128)
    @MinLength(2)
    lastname: string;
}
