import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeTransaction } from '../income-transaction/entities/income-transaction.entity';
import { ExpenseTransaction } from '../expense-transaction/entities/expense-transaction.entity';
import { WeblogModule } from 'src/weblog/weblog.module';
import { BudgetModule } from 'src/budget/budget.module';
import { IncomeEstimationModule } from 'src/income-estimation/income-estimation.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { ExpenseTransactionModule } from 'src/expense-transaction/expense-transaction.module';
import { IncomeTransactionModule } from 'src/income-transaction/income-transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    WeblogModule,
    BudgetModule,
    IncomeEstimationModule,
    WalletModule,
    ExpenseTransactionModule,
    IncomeTransactionModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule { }
