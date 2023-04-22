import { forwardRef, Module } from '@nestjs/common';
import { ExpenseTransactionService } from './expense-transaction.service';
import { ExpenseTransactionController } from './expense-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseTransaction } from 'src/expense-transaction/entities/expense-transaction.entity';
import { WeblogModule } from 'src/weblog/weblog.module';
import { BudgetModule } from 'src/budget/budget.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExpenseTransaction,
    ]),
    WeblogModule,
    forwardRef(() => BudgetModule),
    WalletModule,
  ],
  controllers: [ExpenseTransactionController],
  providers: [ExpenseTransactionService],
  exports: [ExpenseTransactionService]
})
export class ExpenseTransactionModule { }
