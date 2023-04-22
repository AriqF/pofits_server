import { IncomeCategory } from "src/income-category/entities/income-category.entity";
import { User } from "src/user/entities/user.entity";
import { Wallet } from "src/wallet/entities/wallet.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("income_transactions")
export class IncomeTransaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "bigint" })
    amount: number;

    @ManyToOne(() => IncomeCategory, category => category.id, { eager: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "category" })
    category: IncomeCategory;

    @Column({ type: "date" })
    date: Date;

    @Column({ length: 75 })
    title: string;

    @Column({ length: 255, nullable: true })
    description: string;

    @ManyToOne(() => Wallet, wallet => wallet.id, { eager: true })
    @JoinColumn({ name: "wallet" })
    wallet: Wallet;

    @ManyToOne(() => User, user => user.id, { eager: true })
    @JoinColumn({ name: "created_by" })
    created_by: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}