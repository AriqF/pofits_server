import { IsString, IsNotEmpty, MaxLength, IsOptional } from "class-validator";


export class UpdateWalletDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    description: string;

}