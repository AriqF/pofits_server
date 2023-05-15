import { Controller, Query } from '@nestjs/common';
import { Body, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common/decorators';
import { RealIp } from 'nestjs-real-ip';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';

import { TransactionService } from './transaction.service';
import { TransactionsRecapDto } from './dto/recap-filter.dto';
import { TransactionsFilterDto } from './dto/transactions-filter.dto';
import { AllTransactionsFilterDto } from './dto/all-transactions-filter.dto';
import { AnnualTransactionDto } from './dto/annual-filter.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }


  @Get("me")
  @UseGuards(JwtAuthGuard)
  getAllUserTransactions(@GetUser() user: User, @Query() filter: AllTransactionsFilterDto) {
    if (Object.keys(filter).length) {
      return this.transactionService.getAllFilterUserTransactions(user, filter);
    }
    return this.transactionService.getAllUserTransactions(user)
  }

  @Get("me/month-recap")
  @UseGuards(JwtAuthGuard)
  getMonthRecap(@GetUser() user: User, @Query() dto: TransactionsRecapDto) {
    return this.transactionService.getTransactionsRecap(user, dto);
  }

  @Get("me/annual-recap")
  @UseGuards(JwtAuthGuard)
  getAnnualRecap(@GetUser() user: User, @Query() dto: AnnualTransactionDto) {
    return this.transactionService.getAnnualTransactions(dto, user)
  }

}
