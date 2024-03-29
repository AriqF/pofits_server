import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity('expense_categories')
export class ExpenseCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 35 })
    title: string;

    @Column({ nullable: true, length: 100 })
    description: string;

    @Column({ type: "boolean", default: false })
    isGlobal: boolean;

    @Column()
    icon: string;

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