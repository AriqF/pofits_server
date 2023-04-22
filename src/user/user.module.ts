import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { WeblogModule } from 'src/weblog/weblog.module';
import { ExpenseCategoryModule } from 'src/expense-category/expense-category.module';
import { IncomeCategoryModule } from 'src/income-category/income-category.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    forwardRef(() => WeblogModule),
    forwardRef(() => IncomeCategoryModule),
    forwardRef(() => ExpenseCategoryModule),
    forwardRef(() => WalletModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }