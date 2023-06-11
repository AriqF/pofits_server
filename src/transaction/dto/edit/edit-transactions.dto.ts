import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, isNotEmpty } from "class-validator";
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

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    date: Date;
}