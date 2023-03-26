import { IsNotEmpty, IsString, MaxLength, IsOptional, MinLength } from "class-validator";



export class CreateExpenseCatDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(75)
    @MinLength(2)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(225)
    description?: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    icon: string;
}