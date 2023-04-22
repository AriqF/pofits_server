import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ExpenseCategory } from "src/expense-category/entities/expense-category.entity";
import { IncomeCategory } from "src/income-category/entities/income-category.entity";
import { Wallet } from "src/wallet/entities/wallet.entity";


export class BaseAddTransactionDto {

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    description: string;

    @IsOptional()
    wallet: Wallet;

    @Type(() => Date)
    @IsNotEmpty()
    @IsDate()
    date: Date;
}