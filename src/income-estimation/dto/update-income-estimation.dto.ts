import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty } from 'class-validator';
import { } from './create-income-estimation.dto';

export class UpdateIncomeEstimationDto {
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}
