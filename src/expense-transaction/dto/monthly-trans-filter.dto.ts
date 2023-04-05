import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";
import { ExpenseCategory } from "src/expense-category/entities/expense-category.entity";

export class ExpenseMonthlyFilterDto {
    @IsNotEmpty()
    category: ExpenseCategory;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    date: Date;
}