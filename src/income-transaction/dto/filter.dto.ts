import { IsOptional } from "class-validator";
import { IncomeCategory } from "src/income-category/entities/income-category.entity";
import { TransactionsFilterDto } from "src/transaction/dto/transactions-filter.dto";


export class IncomeTransFilterDto extends TransactionsFilterDto {
    @IsOptional()
    category?: IncomeCategory;
}