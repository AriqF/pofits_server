import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class TransactionsFilterDto {

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    start_date?: Date;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    end_date?: Date;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    take?: number;

    @Type(() => String)
    @IsOptional()
    @IsString()
    orderby?: "ASC" | "DESC"
}