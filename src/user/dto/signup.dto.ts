import { IsDefined, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Match } from "src/utils/decorator/match.decorator";

export class UserRegisterDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        each: true,
        message: "Password has to contain at least upper and lower case letter, and contain number or special character"
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Match('password')
    password_confirmation: string;
}