import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LogType } from "../interfaces/log-type.enum";
import { User } from "src/user/entities/user.entity";

@Entity('weblogs')
export class Weblog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    log: string;

    @Column()
    module: string;

    @Column({ type: "enum", default: LogType.Info, enum: LogType })
    type: LogType;

    @Column({ length: 255 })
    ip_address: string;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: "created_by" })
    created_by: User;

    @CreateDateColumn()
    created_at: Date;
}