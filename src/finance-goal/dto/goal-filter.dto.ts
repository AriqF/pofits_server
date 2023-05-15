import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";


export class GoalFilterDto {

    @IsString()
    @IsOptional()
    search?: string;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    achieved?: boolean;

    @IsOptional()
    order?: "ASC" | "DESC";

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    take?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    page?: number;
}