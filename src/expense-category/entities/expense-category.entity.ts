import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity('expense_categories')
export class ExpenseCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 75 })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: "boolean", default: false })
    isGlobal: boolean;

    @ManyToOne(() => User, user => user.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "created_by" })
    created_by: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}