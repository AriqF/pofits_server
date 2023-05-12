import { User } from "src/user/entities/user.entity";
import { Wallet } from "src/wallet/entities/wallet.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SavingFrequencies } from "../interfaces/goal.enum";


@Entity("finance_goals")
export class FinanceGoal {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "created_by" })
    created_by: User;

    @Column({ length: 50 })
    title: string;

    @Column({ type: "boolean", default: true })
    isFlexible: boolean;

    @Column({ type: "bigint", nullable: false })
    amount_target: number;

    @Column({ type: "bigint", default: 0 })
    amount_reached: number;

    @Column({ type: "date", nullable: true })
    timebound: Date;

    @Column({ type: "enum", nullable: false, enum: SavingFrequencies, default: SavingFrequencies.Monthly })
    frequencies: SavingFrequencies

    @Column({ type: "bigint", default: 0, nullable: false })
    amount_per_frequency: number;

    @ManyToOne(() => Wallet, wallet => wallet.id, { onDelete: "CASCADE", nullable: true })
    wallet: Wallet;

    @Column({ type: "boolean", default: false })
    isAchieved: boolean;

    /*
    0 = low
    1 = medium
    2 = high
    */
    @Column({ type: "tinyint", default: 1 })
    priority: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}