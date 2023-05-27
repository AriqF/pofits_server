import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Wallet } from "src/wallet/entities/wallet.entity";


export class EditTransactionsDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsOptional()
    wallet: Wallet;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}