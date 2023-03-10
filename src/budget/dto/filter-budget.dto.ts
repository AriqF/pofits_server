import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class BudgetFilterDto {

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    month: Date;

}