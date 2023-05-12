import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";


export class EditGoalStatusDto {

    @IsNumber()
    @Max(2)
    @Min(0)
    @IsNotEmpty()
    status: number;
}