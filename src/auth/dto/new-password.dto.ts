import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from "class-validator";
import { Match } from "src/utils/decorator/match.decorator";
import { UserErrorID } from "src/utils/global/enum/error-message.enum";

export class SetNewPasswordDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
        each: true,
        message: UserErrorID.PasswordRequirement,
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @Match('password')
    password_confirmation: string;
}