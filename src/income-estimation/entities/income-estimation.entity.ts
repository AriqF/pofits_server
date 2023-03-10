import { IncomeCategory } from "src/income-category/entity/income-category.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("income_estimation")
export class IncomeEstimation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => IncomeCategory, category => category.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "category" })
    category: IncomeCategory;

    @Column({ type: "bigint" })
    amount: number;

    @Column({ type: "boolean", default: false })
    isRepeat: boolean;

    @Column({ type: "date" })
    start_date: Date;

    @Column({ type: "date", nullable: true })
    end_date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => User, user => user.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "created_by" })
    created_by: User;
}
