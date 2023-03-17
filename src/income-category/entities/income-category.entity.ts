import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IncomeType } from "../enums/income-type.enum";


@Entity("income_categories")
export class IncomeCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 75 })
    title: string;

    @Column({ length: 255, nullable: true })
    description: string;

    @ManyToOne(() => User, user => user.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "created_by" })
    created_by: User;

    @Column({ enum: IncomeType, type: "enum", default: IncomeType.Active })
    income_type: IncomeType;

    @Column({ type: "boolean", default: false })
    isGlobal: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}