import { Controller, Query } from '@nestjs/common';
import { Body, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common/decorators';
import { RealIp } from 'nestjs-real-ip';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { AddExpTransactionDto } from './dto/add/add-exp-transaction.dto';
import { AddIncTransactionDto } from './dto/add/add-inc-transaction.dto';
import { EditTransactionsDto } from './dto/edit/edit-transactions.dto';
import { TransactionsFilterDto } from './dto/transactions-filter.dto';
import { TransactionType } from './interfaces/transactions.type';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }


  @Get("income/all")
  @UseGuards(JwtAuthGuard)
  getAllIncomeTransactions(@GetUser() user: User, @Query() filter: TransactionsFilterDto) {
    if (Object.keys(filter).length) {
      return this.transactionService.getAllIncTransactionsByFilter(user, filter)
    }
    return this.transactionService.getAllUserIncomeTransactions(user)
  }

  @Get("expense/all")
  @UseGuards(JwtAuthGuard)
  getAllExpenseTransactions(@GetUser() user: User, @Query() filter: TransactionsFilterDto) {
    if (Object.keys(filter).length) {
      return this.transactionService.getAllExpTransactionsByFilter(user, filter)
    }
    return this.transactionService.getAllUserExpenseTransactions(user)
  }

  @Get("income/:id")
  @UseGuards(JwtAuthGuard)
  getIncomeById(@Param("id") id: number, @GetUser() user: User) {
    return this.transactionService.getIncomeTransactionsById(id, user)
  }

  @Get("expense/:id")
  @UseGuards(JwtAuthGuard)
  getExpenseById(@Param("id") id: number, @GetUser() user: User) {
    return this.transactionService.getExpenseTransactionsById(id, user)
  }

  @Post("expense/add")
  @UseGuards(JwtAuthGuard)
  addExpenseTransaction(@Body() dto: AddExpTransactionDto, @GetUser() user: User, @RealIp() ip: string) {
    return this.transactionService.addExpenseTransactions(user, dto, ip);
  }

  @Post("income/add")
  @UseGuards(JwtAuthGuard)
  addIncomeTransactions(@Body() dto: AddIncTransactionDto, @GetUser() user: User, @RealIp() ip: string) {
    return this.transactionService.addIncomeTransactions(user, dto, ip);
  }

  @Patch("expense/edit/:id")
  @UseGuards(JwtAuthGuard)
  editExpenseTransaction(@Param("id") id: number, @Body() dto: EditTransactionsDto, @GetUser() user: User, @RealIp() ip: string) {
    return this.transactionService.editExpense(id, user, dto, ip);
  }

  @Patch("income/edit/:id")
  @UseGuards(JwtAuthGuard)
  editIncomeTransaction(@Param("id") id: number, @Body() dto: EditTransactionsDto, @GetUser() user: User, @RealIp() ip: string) {
    return this.transactionService.editIncome(id, user, dto, ip);
  }

  @Delete("expense/delete/:id")
  @UseGuards(JwtAuthGuard)
  hardDeleteExpense(@Param("id") id: number, @GetUser() user: User, @RealIp() ip: string) {
    return this.transactionService.hardDeleteExpense(id, user, ip);
  }

  @Delete("income/delete/:id")
  @UseGuards(JwtAuthGuard)
  hardDeleteIncome(@Param("id") id: number, @GetUser() user: User, @RealIp() ip: string) {
    return this.transactionService.hardDeleteIncome(id, user, ip)
  }
}
