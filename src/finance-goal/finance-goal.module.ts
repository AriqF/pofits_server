import { Module } from '@nestjs/common';
import { FinanceGoalController } from './finance-goal.controller';
import { FinanceGoalService } from './finance-goal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceGoal } from './entities/finance-goal.entity';
import { WeblogModule } from 'src/weblog/weblog.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { FinanceGoalHistory } from '../goal-transaction-history/entities/finance-goal-history.entity';
import { GoalTransactionHistoryModule } from 'src/goal-transaction-history/goal-transaction-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FinanceGoal,
      FinanceGoalHistory,
    ]),
    WeblogModule,
    WalletModule,
    GoalTransactionHistoryModule,
  ],
  controllers: [FinanceGoalController],
  providers: [FinanceGoalService]
})
export class FinanceGoalModule { }
