import { Type } from "class-transformer";
import { IsNumber, IsNotEmpty, IsBoolean, IsDate, IsOptional } from "class-validator";
import { IncomeCategory } from "src/income-category/entity/income-category.entity";

export class CreateEstimationDto {
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    category: IncomeCategory;

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
