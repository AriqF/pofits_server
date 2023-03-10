import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateBudgetDto {

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}