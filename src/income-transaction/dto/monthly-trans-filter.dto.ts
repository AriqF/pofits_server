import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { IncomeCategory } from "src/income-category/entities/income-category.entity";


export class IncomeMonthlyFilterDto {
    @IsNotEmpty()
    category: IncomeCategory;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    date: Date;
}