import { forwardRef, Module } from '@nestjs/common';
import { ExpenseCategoryService } from './expense-category.service';
import { ExpenseCategoryController } from './expense-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseCategory } from './entities/expense-category.entity';
import { WeblogModule } from 'src/weblog/weblog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExpenseCategory,
    ]),
    forwardRef(() => WeblogModule)
  ],
  providers: [ExpenseCategoryService],
  controllers: [ExpenseCategoryController],
  exports: [ExpenseCategoryService],
})
export class ExpenseCategoryModule { }
