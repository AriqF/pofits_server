import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RealIp } from 'nestjs-real-ip';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EditTransactionsDto } from 'src/transaction/dto/edit/edit-transactions.dto';
import { TransactionsFilterDto } from 'src/transaction/dto/transactions-filter.dto';
import { User } from 'src/user/entities/user.entity';
import { AddExpTransactionDto } from './dto/add-exp-transaction.dto';
import { ExpenseTransactionService } from './expense-transaction.service';

@Controller('transaction/expense')
export class ExpenseTransactionController {
  constructor(private readonly expenseService: ExpenseTransactionService) { }


  @Get("all")
  @UseGuards(JwtAuthGuard)
  getAllExpenseTransactions(@GetUser() user: User, @Query() filter: TransactionsFilterDto) {
    if (Object.keys(filter).length) {
      return this.expenseService.getAllExpTransactionsByFilter(user, filter)
    }
    return this.expenseService.getAllUserExpenseTransactions(user)
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  getExpenseById(@Param("id") id: number, @GetUser() user: User) {
    return this.expenseService.getExpenseTransactionsById(id, user)
  }

  @Post("add")
  @UseGuards(JwtAuthGuard)
  addExpenseTransaction(@Body() dto: AddExpTransactionDto, @GetUser() user: User, @RealIp() ip: string) {
    return this.expenseService.addExpenseTransactions(user, dto, ip);
  }



  @Patch("edit/:id")
  @UseGuards(JwtAuthGuard)
  editExpenseTransaction(@Param("id") id: number, @Body() dto: EditTransactionsDto, @GetUser() user: User, @RealIp() ip: string) {
    return this.expenseService.editExpense(id, user, dto, ip);
  }



  @Delete("delete/:id")
  @UseGuards(JwtAuthGuard)
  hardDeleteExpense(@Param("id") id: number, @GetUser() user: User, @RealIp() ip: string) {
    return this.expenseService.hardDeleteExpense(id, user, ip);
  }

}
