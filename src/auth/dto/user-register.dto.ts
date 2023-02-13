

import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Match } from "src/decorator/match.decorator";

export class UserRegisterDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(25)
    @MinLength(5)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
        each: true,
        message: "Password has to contain number or special character"
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    @Match('password')
    @MinLength(5)
    password_confirmation: string;
}