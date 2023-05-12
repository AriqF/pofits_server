import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FinanceGoal } from "../../finance-goal/entities/finance-goal.entity";
import { User } from "src/user/entities/user.entity";


@Entity("goal_history")
export class FinanceGoalHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30, nullable: false, default: "menabung rutin" })
    title: string;

    @Column({ type: "date", nullable: false })
    date: Date;

    @ManyToOne(() => FinanceGoal, goal => goal.id, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "goal" })
    goal: FinanceGoal;

    @Column({ type: "bigint" })
    amount: number;

    @ManyToOne(() => User, user => user.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "created_by" })
    created_by: User;

    @CreateDateColumn()
    created_at: Date;
}