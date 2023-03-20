import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import * as moment from 'moment';
import { BudgetService } from 'src/budget/budget.service';
import { User } from 'src/user/entities/user.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { LogType } from 'src/weblog/interfaces/log-type.enum';
import { WeblogService } from 'src/weblog/weblog.service';
import { IncomeTransactionService } from 'src/income-transaction/income-transaction.service';
import { ExpenseTransactionService } from 'src/expense-transaction/expense-transaction.service';

const thisModule = "Transactions";

@Injectable()
export class TransactionService {
    constructor(
        private incomeService: IncomeTransactionService,
        private expenseService: ExpenseTransactionService,
        private logService: WeblogService,
        private budgetService: BudgetService,
        private walletService: WalletService,
    ) { }

}
