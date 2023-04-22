import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { IncomeType } from "../enums/income-type.enum";


export class CreateIncCatDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(35)
    @MinLength(2)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    description?: string;

    @IsNotEmpty()
    @IsEnum(IncomeType, { message: "jenis pemasukan berupa 'aktif' atau 'pasif'" })
    income_type: IncomeType;

    @IsNotEmpty()
    @IsString()
    icon: string;
}