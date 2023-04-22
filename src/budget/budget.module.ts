import { forwardRef, Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { WeblogModule } from 'src/weblog/weblog.module';
import { ExpenseTransactionModule } from 'src/expense-transaction/expense-transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Budget,
    ]),
    forwardRef(() => ExpenseTransactionModule),
    WeblogModule
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
  exports: [BudgetService],
})
export class BudgetModule { }
