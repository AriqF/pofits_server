import { IsString, IsNotEmpty, MaxLength, IsOptional, IsEnum } from "class-validator";
import { WalletCategory } from "../interfaces/wallet-category.enum";


export class UpdateWalletDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    description: string;

    // @IsString()
    @IsEnum(WalletCategory, { message: "Kategori: Rekening Bank, E-Money, atau, Tunai" })
    @IsNotEmpty()
    category: WalletCategory;

}