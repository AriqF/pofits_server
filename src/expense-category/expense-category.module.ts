import { Module } from '@nestjs/common';
import { ExpenseCategoryService } from './expense-category.service';
import { ExpenseCategoryController } from './expense-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseCategory } from './entity/expense-category.entity';
import { WeblogModule } from 'src/weblog/weblog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExpenseCategory,
    ]),
    WeblogModule
  ],
  providers: [ExpenseCategoryService],
  controllers: [ExpenseCategoryController]
})
export class ExpenseCategoryModule { }
