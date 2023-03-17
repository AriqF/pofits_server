import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ExpenseCategory } from "src/expense-category/entity/expense-category.entity";
import { IncomeCategory } from "src/income-category/entity/income-category.entity";
import { Wallet } from "src/wallet/entity/wallet.entity";


export class BaseAddTransactionDto {

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsOptional()
    wallet: Wallet;

    @Type(() => Date)
    @IsNotEmpty()
    @IsDate()
    date: Date;
}