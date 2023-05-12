import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { WeblogModule } from './weblog/weblog.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { IncomeCategoryModule } from './income-category/income-category.module';
import { ExpenseCategoryModule } from './expense-category/expense-category.module';
import { BudgetModule } from './budget/budget.module';
import { IncomeEstimationModule } from './income-estimation/income-estimation.module';
import { TransactionModule } from './transaction/transaction.module';
import { ExpenseTransactionModule } from './expense-transaction/expense-transaction.module';
import { IncomeTransactionModule } from './income-transaction/income-transaction.module';
import { FinanceGoalModule } from './finance-goal/finance-goal.module';
import { GoalTransactionHistoryModule } from './goal-transaction-history/goal-transaction-history.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          __dirname + '/../**/entities/*.entity.{js,ts}'
        ],
        migrations: [
          __dirname + '/migrations/*{.ts,.js}'
        ],
        cli: {
          migrationsDir: 'src/migrations'
        },
        migrationsTableName: "migrations_typeorm",
        migrationsRun: true,
        synchronize: true,
        dropSchema: false,
        logging: false,
        autoLoadEntities: true,
        timezone: 'Z',
      }),
    }),
    AuthModule,
    UserModule,
    WeblogModule,
    EmailModule,
    WalletModule,
    IncomeCategoryModule,
    ExpenseCategoryModule,
    BudgetModule,
    IncomeEstimationModule,
    TransactionModule,
    ExpenseTransactionModule,
    IncomeTransactionModule,
    FinanceGoalModule,
    GoalTransactionHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
