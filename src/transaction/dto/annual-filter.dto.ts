import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";


export class AnnualTransactionDto {
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    date: Date;
}