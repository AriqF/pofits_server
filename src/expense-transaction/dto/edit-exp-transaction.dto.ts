import { IsNotEmpty } from "class-validator";
import { ExpenseCategory } from "src/expense-category/entities/expense-category.entity";
import { EditTransactionsDto } from "src/transaction/dto/edit/edit-transactions.dto";


export class EditExpTransactionDto extends EditTransactionsDto {
    @IsNotEmpty()
    category: ExpenseCategory;
}