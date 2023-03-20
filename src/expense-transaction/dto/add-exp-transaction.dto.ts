import { IsNotEmpty } from "class-validator";
import { ExpenseCategory } from "src/expense-category/entities/expense-category.entity";
import { BaseAddTransactionDto } from "../../transaction/dto/add/base-add-transaction.dto";



export class AddExpTransactionDto extends BaseAddTransactionDto {

    @IsNotEmpty()
    category: ExpenseCategory;
}