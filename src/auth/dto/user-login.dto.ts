import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserLoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsBoolean()
    @IsNotEmpty()
    isKeepSignedIn: boolean;
}