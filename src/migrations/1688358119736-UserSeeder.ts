import { MigrationInterface, QueryRunner } from "typeorm"
import * as bc from 'bcrypt';
import { User } from "src/user/entities/user.entity";
import { Role } from "src/auth/role.enum";
export class UserSeeder1688358119736 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const password = "halo123";
        const salt = await bc.genSalt();
        const hashedPassword = await bc.hash(password, salt);
        queryRunner.manager.createQueryBuilder()
            .insert()
            .into(User)
            .values({
                email: "ariq.19047@mhs.unesa.ac.id",
                password: hashedPassword,
                role: Role.Admin,
                firstname: "Ariq",
                lastname: "Fachry",
            })
            .orIgnore()
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
