import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";


export class AddSavingDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    title: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    amount: number;
}