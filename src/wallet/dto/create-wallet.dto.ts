import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { WalletCategory } from "../interfaces/wallet-category.enum";


export class CreateWalletDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    description: string;

    @IsEnum(WalletCategory)
    category: WalletCategory;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    amount: number;
}