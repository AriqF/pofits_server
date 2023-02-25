import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { IncomeType } from "../enums/income-type.enum";


export class CreateIncCatDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(75)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(225)
    description: string;

    @IsNotEmpty()
    @IsEnum(IncomeType, { message: "jenis pemasukan berupa 'aktif' atau 'pasif'" })
    income_type: IncomeType;
}