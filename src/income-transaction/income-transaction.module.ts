import { Module, forwardRef } from '@nestjs/common';
import { IncomeTransactionService } from './income-transaction.service';
import { IncomeTransactionController } from './income-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeTransaction } from 'src/income-transaction/entities/income-transaction.entity';
import { WeblogModule } from 'src/weblog/weblog.module';
import { IncomeEstimationModule } from 'src/income-estimation/income-estimation.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IncomeTransaction
    ]),
    WeblogModule,
    forwardRef(() => IncomeEstimationModule),
    WalletModule,
  ],
  controllers: [IncomeTransactionController],
  providers: [IncomeTransactionService],
  exports: [IncomeTransactionService],
})
export class IncomeTransactionModule { }
