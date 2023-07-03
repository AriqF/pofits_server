import { User } from "src/user/entities/user.entity";
import { Wallet } from "src/wallet/entities/wallet.entity";
import { WalletCategory } from "src/wallet/interfaces/wallet-category.enum";
import { MigrationInterface, QueryRunner } from "typeorm"

export class WalletSeeder1688358145922 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const creatorRef: User = await queryRunner.manager
            .createQueryBuilder(User, 'u')
            .where('u.id = 1')
            .getOne();
        queryRunner.manager.createQueryBuilder()
            .insert()
            .into(Wallet)
            .values([
                {
                    name: "BCA",
                    amount: 6000000,
                    category: WalletCategory.Bank,
                    icon: "bank",
                    created_by: creatorRef
                },
                {
                    name: "Tunai",
                    amount: 240000,
                    category: WalletCategory.Cash,
                    icon: "fees",
                    created_by: creatorRef
                },
                {
                    name: "Gopay",
                    amount: 2600000,
                    category: WalletCategory.EMoney,
                    icon: "mobile",
                    created_by: creatorRef
                },
            ])
            .orIgnore()
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

// queryRunner.manager.createQueryBuilder()
// .insert()
// .into(Wallet)
// .values({

// })
// .orIgnore()
// .execute();
