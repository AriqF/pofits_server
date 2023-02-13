import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";


export class UserFilterDto {

    @IsString()
    @IsOptional()
    search: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    status: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page: number;
}