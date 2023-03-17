import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeTransaction } from './entities/income-transaction.entity';
import { ExpenseTransaction } from './entities/expense-transaction.entity';
import { WeblogModule } from 'src/weblog/weblog.module';
import { BudgetModule } from 'src/budget/budget.module';
import { IncomeEstimationModule } from 'src/income-estimation/income-estimation.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IncomeTransaction,
      ExpenseTransaction,
    ]),
    WeblogModule,
    BudgetModule,
    IncomeEstimationModule,
    WalletModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule { }
