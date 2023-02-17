

import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Match } from "src/utils/decorator/match.decorator";
import { UserErrorID } from "src/utils/global/enum/error-message.enum";

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
        message: UserErrorID.PasswordRequirement
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    @Match('password')
    @MinLength(5)
    password_confirmation: string;
}