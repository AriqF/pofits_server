import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeblogModule } from 'src/weblog/weblog.module';
import { IncomeCategory } from './entities/income-category.entity';
import { IncomeCategoryController } from './income-category.controller';
import { IncomeCategoryService } from './income-category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IncomeCategory
    ]),
    forwardRef(() => WeblogModule),
  ],
  controllers: [IncomeCategoryController],
  providers: [IncomeCategoryService],
  exports: [IncomeCategoryService],
})
export class IncomeCategoryModule { }
