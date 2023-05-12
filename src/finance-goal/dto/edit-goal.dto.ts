import { Type } from "class-transformer";
import { IsString, MaxLength, IsNotEmpty, IsOptional, IsNumber, IsDate, Max, Min, IsBoolean, IsEnum } from "class-validator";
import { Wallet } from "src/wallet/entities/wallet.entity";
import { SavingFrequencies } from "../interfaces/goal.enum";


export class EditGoalDto {
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    title: string;

    @IsBoolean()
    @IsNotEmpty()
    isFlexible: boolean;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    amount_target: number;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    timebound?: Date;

    @IsNotEmpty()
    @IsEnum(SavingFrequencies)
    frequencies: SavingFrequencies;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    amount_per_frequency: number;

    @IsOptional()
    @Type(() => Number)
    wallet?: Wallet;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(2)
    priority: number;
}