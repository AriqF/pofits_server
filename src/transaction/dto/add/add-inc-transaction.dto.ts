import { IsNotEmpty } from "class-validator";
import { IncomeCategory } from "src/income-category/entity/income-category.entity";
import { BaseAddTransactionDto } from "./base-add-transaction.dto";


export class AddIncTransactionDto extends BaseAddTransactionDto {

    @IsNotEmpty()
    category: IncomeCategory;
}
