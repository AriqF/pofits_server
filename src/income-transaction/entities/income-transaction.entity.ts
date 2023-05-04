import { IncomeCategory } from "src/income-category/entities/income-category.entity";
import { BaseTransactionEntity } from "src/transaction/entities/base-transaction.entity";
import { User } from "src/user/entities/user.entity";
import { Wallet } from "src/wallet/entities/wallet.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("income_transactions")
export class IncomeTransaction extends BaseTransactionEntity {
    @ManyToOne(() => IncomeCategory, category => category.id, { eager: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "category" })
    category: IncomeCategory;
}