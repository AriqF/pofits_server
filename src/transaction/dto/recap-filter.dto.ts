import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional } from "class-validator";


export class TransactionsRecapDto {
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    month: Date;
}