import { IsNotEmpty, IsString, MaxLength, IsOptional } from "class-validator";



export class CreateExpenseCatDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(75)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(225)
    description: string;
}