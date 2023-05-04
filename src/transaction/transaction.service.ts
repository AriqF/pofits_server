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
import { GetTransactionsResponse, TransactionType } from './interfaces/transactions.type';
import { TransactionsRecapDto } from './dto/recap-filter.dto';
import { TransactionsFilterDto } from './dto/transactions-filter.dto';
import { getDateEndMonth, getDateStartMonth } from 'src/utils/helper';
import { IncomeTransaction } from 'src/income-transaction/entities/income-transaction.entity';
import { ExpenseTransaction } from 'src/expense-transaction/entities/expense-transaction.entity';
import { AllTransactionsFilterDto } from './dto/all-transactions-filter.dto';
import { DataErrorID } from 'src/utils/global/enum/error-message.enum';
import { ICategoriesSpent } from 'src/expense-transaction/entities/categories-spent.interface';

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


    async getAllUserTransactions(user: User): Promise<GetTransactionsResponse[]> {
        const expenses = await this.expenseService.getAllUserExpenseTransactions(user);
        const incomes = await this.incomeService.getAllUserIncomeTransactions(user);
        return this.mergeTransactionsData(incomes, expenses, "date", "DESC")
    }

    async getAllFilterUserTransactions(user: User, dto: AllTransactionsFilterDto): Promise<GetTransactionsResponse[]> {
        let incomes: IncomeTransaction[] = [];
        let expenses: ExpenseTransaction[] = [];

        if (!dto.start_date && !dto.end_date) {
            dto.start_date = new Date(getDateStartMonth(new Date()))
            dto.end_date = new Date(getDateEndMonth(new Date()))
        }
        if (!dto.end_date) dto.end_date = dto.start_date

        if (dto.includeExp) {
            expenses = await this.expenseService.getAllExpTransactionsByFilter(user, dto);
        }
        if (dto.includeInc) {
            incomes = await this.incomeService.getAllIncTransactionsByFilter(user, dto);
        }
        const transactions = await this.mergeTransactionsData(incomes, expenses, "date", "DESC");
        // if (transactions.length == 0) throw new NotFoundException(DataErrorID.FilterNotFound)
        return transactions
    }

    async getTransactionsAmountInfo(user: User, dto: TransactionsRecapDto) {
        let filter: TransactionsFilterDto = new TransactionsFilterDto();
        filter = { start_date: getDateStartMonth(dto.month), end_date: getDateEndMonth(dto.month) }
        const expenses = await this.expenseService.getAllExpTransactionsByFilter(user, filter);
        const incomes = await this.incomeService.getAllIncTransactionsByFilter(user, filter);

        let totalExpenses: number = 0;
        let totalIncomes: number = 0;
        let amountDiff: number = 0;
        expenses.map((exp) => {
            totalExpenses += Number(exp.amount);
        })
        incomes.map((inc) => {
            totalIncomes += Number(inc.amount);
        })
        amountDiff = totalIncomes - totalExpenses;

        return { totalExpenses, totalIncomes, amountDiff }
    }

    async getTransactionsRecap(user: User, dto: TransactionsRecapDto) {
        const transactionAmountInfo = await this.getTransactionsAmountInfo(user, dto);
        const expensesAllocation = await this.expenseService.getMonthCategoriesSpentPercentage(dto, user);
        const incomesAllocation = await this.incomeService.getMonthCategoriesPercentage(dto, user);

        const sortedExpAlloc = this.sortPercentageCatSpent(expensesAllocation);
        const sortedIncAlloc = this.sortPercentageCatSpent(incomesAllocation)

        return {
            ...transactionAmountInfo, expensesAllocation: sortedExpAlloc, incomesAllocation: sortedIncAlloc
        }
    }

    async mergeTransactionsData(incomes: IncomeTransaction[], expenses: ExpenseTransaction[],
        sortByProps: string, order: "ASC" | "DESC"): Promise<GetTransactionsResponse[]> {

        let results: GetTransactionsResponse[] = [];
        expenses.map((item) => {
            results.push({ ...item, type: TransactionType.Expense })
        })
        incomes.map((item) => {
            results.push({ ...item, type: TransactionType.Income });
        })
        return results.sort(this.dynamicSort(sortByProps, order))
    }

    dynamicSort(property: string, order: "ASC" | "DESC") {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substring(1)
        }
        return function (a: any, b: any) {
            /* next line works with strings and numbers, 
             * and you may want to customize it to your needs           
             */
            let result: number;
            if (order === "DESC") {
                result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
            } else {
                result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            }
            return result * sortOrder;
        }
    }

    sortPercentageCatSpent(data: ICategoriesSpent[]) {
        return data.sort((a, b) => b.percentage - a.percentage);
    }
}
