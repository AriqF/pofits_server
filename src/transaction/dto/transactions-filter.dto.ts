import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class TransactionsFilterDto {

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    date: Date;

    @IsOptional()
    @IsString()
    search: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    take: number;

    @Type(() => String)
    @IsOptional()
    @IsString()
    orderby: "ASC" | "DESC"
}