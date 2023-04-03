import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { WalletCategory } from "../interfaces/wallet-category.enum";


@Entity('wallets')
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, length: 20 })
    name: string;

    @Column({ length: 255, nullable: true })
    description: string;

    @Column({ type: "bigint" })
    amount: number;

    @Column({ type: "enum", default: WalletCategory.Bank, enum: WalletCategory })
    category: WalletCategory;

    @Column({ length: 50, nullable: false, default: "Rekening Bank" })
    icon: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => User, user => user.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "created_by" })
    created_by: User
}