import { IsNotEmpty, IsString, MaxLength, IsOptional, MinLength } from "class-validator";



export class CreateExpenseCatDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(35)
    @MinLength(3)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    description?: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    icon: string;
}