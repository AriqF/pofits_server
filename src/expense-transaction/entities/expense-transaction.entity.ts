import { ExpenseCategory } from "src/expense-category/entities/expense-category.entity";
import { BaseTransactionEntity } from "src/transaction/entities/base-transaction.entity";
import { User } from "src/user/entities/user.entity";
import { Wallet } from "src/wallet/entities/wallet.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("expense_transactions")
export class ExpenseTransaction extends BaseTransactionEntity {
    @ManyToOne(() => ExpenseCategory, category => category.id, { eager: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "category" })
    category: ExpenseCategory;
}

