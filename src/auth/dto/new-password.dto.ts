import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from "class-validator";
import { Match } from "src/decorator/match.decorator";

export class SetNewPasswordDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
        each: true,
        message: "Password has to contain number or special character"
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @Match('password')
    password_confirmation: string;
}