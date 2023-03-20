import { IsNotEmpty } from "class-validator";
import { IncomeCategory } from "src/income-category/entities/income-category.entity";
import { BaseAddTransactionDto } from "../../transaction/dto/add/base-add-transaction.dto";


export class AddIncTransactionDto extends BaseAddTransactionDto {

    @IsNotEmpty()
    category: IncomeCategory;
}
