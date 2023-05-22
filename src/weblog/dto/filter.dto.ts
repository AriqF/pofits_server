import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";


export class LogFilterDto {
    @IsOptional()
    @IsNumber()
    year: number;

    @IsOptional()
    @IsNumber()
    month: number;

    @IsString()
    @IsOptional()
    search?: string;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    take?: number;

    @IsOptional()
    page?: number;
}