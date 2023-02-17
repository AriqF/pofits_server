import { IsNotEmpty, IsString, MinLength, Matches } from "class-validator";
import { SetNewPasswordDto } from "src/auth/dto/new-password.dto";


export class ChangePasswordDto extends SetNewPasswordDto {
    @IsNotEmpty()
    @IsString()
    old_password: string;
}