import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ExpenseCategory } from "src/expense-category/entity/expense-category.entity";


export class CreateBudgetDto {

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    amount: number;

    @IsNotEmpty()
    category: ExpenseCategory;

    @IsBoolean()
    @IsNotEmpty()
    isRepeat: boolean;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    start_date: Date;


    @Type(() => Date)
    @IsDate()
    @IsOptional()
    end_date: Date;
}