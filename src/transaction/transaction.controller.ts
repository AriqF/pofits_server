import { Controller, Query } from '@nestjs/common';
import { Body, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common/decorators';
import { RealIp } from 'nestjs-real-ip';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { AddExpTransactionDto } from '../expense-transaction/dto/add-exp-transaction.dto';
import { AddIncTransactionDto } from '../income-transaction/dto/add-inc-transaction.dto';
import { EditTransactionsDto } from './dto/edit/edit-transactions.dto';
import { TransactionsFilterDto } from './dto/transactions-filter.dto';
import { TransactionType } from './interfaces/transactions.type';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }


}
