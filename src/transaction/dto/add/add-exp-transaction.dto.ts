import { IsNotEmpty } from "class-validator";
import { ExpenseCategory } from "src/expense-category/entities/expense-category.entity";
import { BaseAddTransactionDto } from "./base-add-transaction.dto";



export class AddExpTransactionDto extends BaseAddTransactionDto {

    @IsNotEmpty()
    category: ExpenseCategory;
}