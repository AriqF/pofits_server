import { IsNumber, IsOptional } from "class-validator";


export class LogFilterDto {
    @IsOptional()
    @IsNumber()
    year: number;

    @IsOptional()
    @IsNumber()
    month: number;

    @IsOptional()
    page: number = 1;
}