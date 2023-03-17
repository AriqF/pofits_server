import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class EditTransactionsDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}