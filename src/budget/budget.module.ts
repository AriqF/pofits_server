import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entity/budget.entity';
import { WeblogModule } from 'src/weblog/weblog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Budget,
    ]),
    WeblogModule
  ],
  controllers: [BudgetController],
  providers: [BudgetService]
})
export class BudgetModule { }
