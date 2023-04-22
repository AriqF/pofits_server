import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RealIp } from 'nestjs-real-ip';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EditTransactionsDto } from 'src/transaction/dto/edit/edit-transactions.dto';
import { TransactionsFilterDto } from 'src/transaction/dto/transactions-filter.dto';
import { User } from 'src/user/entities/user.entity';
import { AddIncTransactionDto } from './dto/add-inc-transaction.dto';
import { IncomeTransactionService } from './income-transaction.service';
import { IncomeTransFilterDto } from './dto/filter.dto';
import { IncomeMonthlyFilterDto } from './dto/monthly-trans-filter.dto';

@Controller('transaction/income')
export class IncomeTransactionController {
  constructor(private readonly incomeService: IncomeTransactionService) { }

  @Get("all")
  @UseGuards(JwtAuthGuard)
  getAllIncomeTransactions(@GetUser() user: User, @Query() filter: IncomeTransFilterDto) {
    if (Object.keys(filter).length) {
      return this.incomeService.getAllIncTransactionsByFilter(user, filter)
    }
    return this.incomeService.getAllUserIncomeTransactions(user)
  }

  @Get("monthly")
  @UseGuards(JwtAuthGuard)
  getAllMonthlyIncome(@GetUser() user: User, @Query() filter: IncomeMonthlyFilterDto) {
    return this.incomeService.getIncomeTransactionsByCategory(filter.category, filter.date, user)
  }

  @Get("detail/:id")
  @UseGuards(JwtAuthGuard)
  getIncomeById(@Param("id") id: number, @GetUser() user: User) {
    return this.incomeService.getIncomeTransactionsById(id, user)
  }

  @Post("add")
  @UseGuards(JwtAuthGuard)
  addIncomeTransactions(@Body() dto: AddIncTransactionDto, @GetUser() user: User, @RealIp() ip: string) {
    return this.incomeService.addIncomeTransactions(user, dto, ip);
  }

  @Patch("edit/:id")
  @UseGuards(JwtAuthGuard)
  editIncomeTransaction(@Param("id") id: number, @Body() dto: EditTransactionsDto, @GetUser() user: User, @RealIp() ip: string) {
    return this.incomeService.editIncome(id, user, dto, ip);
  }

  @Delete("delete/:id")
  @UseGuards(JwtAuthGuard)
  hardDeleteIncome(@Param("id") id: number, @GetUser() user: User, @RealIp() ip: string) {
    return this.incomeService.hardDeleteIncome(id, user, ip)
  }
}

