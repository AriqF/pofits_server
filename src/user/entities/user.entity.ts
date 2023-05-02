import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../interfaces/role.enum";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 256, nullable: false })
    firstname: string;

    @Column({ length: 128, nullable: false })
    lastname: string;

    @Column({ length: 100, unique: true, nullable: false })
    @IsEmail()
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ type: "tinyint", default: 1 })
    status: number;

    @Column({ type: "boolean", default: false })
    isKeepSignedIn: boolean

    @Column({ type: "enum", default: Role.User, enum: Role })
    role: Role;

    @Column({ length: 500, nullable: true })
    avatar: string;

    @Column({ nullable: true })
    reset_token: string;

    @Column({ nullable: true })
    last_iat: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
