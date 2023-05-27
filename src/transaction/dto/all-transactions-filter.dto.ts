import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { TransactionsFilterDto } from "./transactions-filter.dto";
import { Transform, Type } from "class-transformer";

export class AllTransactionsFilterDto extends TransactionsFilterDto {


    @IsNotEmpty()
    @Transform(({ value }) => value === 'true')
    expenses: boolean;


    @IsNotEmpty()
    @Transform(({ value }) => value === 'true')
    incomes: boolean;

}