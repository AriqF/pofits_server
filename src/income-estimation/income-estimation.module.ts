import { Module, forwardRef } from '@nestjs/common';
import { IncomeEstimationService } from './income-estimation.service';
import { IncomeEstimationController } from './income-estimation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeEstimation } from './entities/income-estimation.entity';
import { WeblogModule } from 'src/weblog/weblog.module';
import { IncomeTransactionModule } from 'src/income-transaction/income-transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IncomeEstimation
    ]),
    WeblogModule,
    forwardRef(() => IncomeTransactionModule)
  ],
  controllers: [IncomeEstimationController],
  providers: [IncomeEstimationService],
  exports: [IncomeEstimationService],
})
export class IncomeEstimationModule { }
