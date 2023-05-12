import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { Wallet } from "src/wallet/entities/wallet.entity";
import { FinanceGoal } from "../entities/finance-goal.entity";
import { SavingFrequencies } from "../interfaces/goal.enum";


export class AddGoalDto {

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

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(2)
    priority: number;

    @IsOptional()
    @Type(() => Number)
    wallet?: Wallet;

}