import { IsString, IsNotEmpty, MaxLength, IsOptional, IsEnum, IsNumber } from "class-validator";
import { WalletCategory } from "../interfaces/wallet-category.enum";
import { Type } from "class-transformer";


export class UpdateWalletDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    amount: number;

    // @IsString()
    @IsEnum(WalletCategory, { message: "Kategori: Rekening Bank, E-Money, atau, Tunai" })
    @IsNotEmpty()
    category: WalletCategory;

}