import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";


export class GoalFilterDto {

    @IsString()
    @IsOptional()
    search?: string;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    achieved?: boolean;

    @IsOptional()
    order?: "ASC" | "DESC";
}