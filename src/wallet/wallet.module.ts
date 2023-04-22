import { Module, forwardRef } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WeblogModule } from 'src/weblog/weblog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Wallet,
    ]),
    forwardRef(() => WeblogModule),
  ],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule { }
