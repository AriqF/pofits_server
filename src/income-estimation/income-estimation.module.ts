import { Module } from '@nestjs/common';
import { IncomeEstimationService } from './income-estimation.service';
import { IncomeEstimationController } from './income-estimation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeEstimation } from './entities/income-estimation.entity';
import { WeblogModule } from 'src/weblog/weblog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IncomeEstimation
    ]),
    WeblogModule
  ],
  controllers: [IncomeEstimationController],
  providers: [IncomeEstimationService],
  exports: [IncomeEstimationService],
})
export class IncomeEstimationModule { }
