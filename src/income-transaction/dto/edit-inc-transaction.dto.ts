import { IsNotEmpty } from "class-validator";
import { IncomeCategory } from "src/income-category/entities/income-category.entity";
import { EditTransactionsDto } from "src/transaction/dto/edit/edit-transactions.dto";


export class EditIncTransactionsDto extends EditTransactionsDto {
    @IsNotEmpty()
    category: IncomeCategory;
}