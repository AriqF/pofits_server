import { Module } from '@nestjs/common';
import { GoalTransactionHistoryController } from './goal-transaction-history.controller';
import { GoalTransactionHistoryService } from './goal-transaction-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceGoalHistory } from 'src/goal-transaction-history/entities/finance-goal-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FinanceGoalHistory,
    ])
  ],
  controllers: [GoalTransactionHistoryController],
  providers: [GoalTransactionHistoryService],
  exports: [GoalTransactionHistoryService],
})
export class GoalTransactionHistoryModule { }
