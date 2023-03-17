import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { BudgetService } from 'src/budget/budget.service';
import { Budget } from 'src/budget/entity/budget.entity';
import { ExpenseCategory } from 'src/expense-category/entity/expense-category.entity';
import { IncomeCategory } from 'src/income-category/entity/income-category.entity';
import { IncomeEstimation } from 'src/income-estimation/entities/income-estimation.entity';
import { IncomeEstimationService } from 'src/income-estimation/income-estimation.service';
import { User } from 'src/user/entities/user.entity';
import { DataErrorID } from 'src/utils/global/enum/error-message.enum';
import { DataSuccessID } from 'src/utils/global/enum/success-message.enum';
import { getDateEndMonth, getDateStartMonth } from 'src/utils/helper';
import { WalletService } from 'src/wallet/wallet.service';
import { LogType } from 'src/weblog/interfaces/log-type.enum';
import { WeblogService } from 'src/weblog/weblog.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AddExpTransactionDto } from './dto/add/add-exp-transaction.dto';
import { AddIncTransactionDto } from './dto/add/add-inc-transaction.dto';
import { EditTransactionsDto } from './dto/edit/edit-transactions.dto';
import { TransactionsFilterDto } from './dto/transactions-filter.dto';
import { ExpenseTransaction } from './entity/expense-transaction.entity';
import { IncomeTransaction } from './entity/income-transaction.entity';
import { TransactionType } from './interfaces/transactions.type';

const thisModule = "Transactions";

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(IncomeTransaction)
        private inTransRepo: Repository<IncomeTransaction>,
        @InjectRepository(ExpenseTransaction)
        private exTransRepo: Repository<ExpenseTransaction>,
        private logService: WeblogService,
        private budgetService: BudgetService,
        private incEstimationService: IncomeEstimationService,
        private walletService: WalletService,
    ) { }


    getQueryIncomeTrans(): SelectQueryBuilder<IncomeTransaction> {
        const query = this.inTransRepo.createQueryBuilder("inc")
            .leftJoin("inc.category", "cat")
            .leftJoin("inc.wallet", "wal")
            .leftJoin("inc.created_by", "cr")
            .select([
                "inc.id", "inc.amount", "inc.category", "inc.date", "inc.title",
                "inc.description", "inc.created_at", "inc.updated_at", "inc.deleted_at",
                "cat.id", "cat.title", "wal.id", "wal.name", "wal.amount", "cr.id", "cr.email",
                "cr.username",
            ])
        return query;
    }

    getQueryExpenseTrans(): SelectQueryBuilder<ExpenseTransaction> {
        const query = this.exTransRepo.createQueryBuilder("exp")
            .leftJoin("exp.category", "cat")
            .leftJoin("exp.wallet", "wal")
            .leftJoin("exp.created_by", "cr")
            .select([
                "exp.id", "exp.amount", "exp.category", "exp.date", "exp.title",
                "exp.description", "exp.created_at", "exp.updated_at", "exp.deleted_at",
                "cat.id", "cat.title", "wal.id", "wal.name", "wal.amount", "cr.id", "cr.email",
                "cr.username",
            ])
        return query;
    }

    async getAllUserExpenseTransactions(user: User): Promise<ExpenseTransaction[]> {
        const data = await this.getQueryExpenseTrans()
            .where("cr.id = :uid", { uid: user.id })
            .orderBy("exp.date", "ASC")
            .getMany()
        if (data.length == 0) throw new NotFoundException(DataErrorID.NotFound)
        return data;
    }

    async getAllUserIncomeTransactions(user: User): Promise<IncomeTransaction[]> {
        const data = await this.getQueryIncomeTrans()
            .where("cr.id = :uid", { uid: user.id })
            .orderBy("inc.date", "ASC")
            .getMany()
        if (data.length == 0) throw new NotFoundException(DataErrorID.NotFound)
        return data;
    }

    async getAllExpTransactionsByFilter(user: User, dto: TransactionsFilterDto) {
        let { search, date, page, take, orderby } = dto;
        if (!page) page = 1

        if (!orderby) orderby = "ASC"
        let data = this.getQueryExpenseTrans()
        if (search) data.where("exp.title LIKE :src", { src: `%${search}%` })

        if (date) data.andWhere("exp.date = :dt", { dt: date })
        data.andWhere("cr.id = :uid", { uid: user.id });

        if (take) data.take(take).skip(take * (page - 1))

        const dataRes = await data.orderBy("exp.date", orderby).getMany();
        if (dataRes.length == 0) throw new NotFoundException(DataErrorID.FilterNotFound)
        return dataRes
    }

    async getAllIncTransactionsByFilter(user: User, dto: TransactionsFilterDto) {
        let { search, date, page, take, orderby } = dto;
        if (!page) page = 1

        if (!orderby) orderby = "ASC"
        let data = this.getQueryIncomeTrans()
        if (search) data.where("exp.title LIKE :src", { src: `%${search}%` })

        if (date) data.andWhere("exp.date = :dt", { dt: date })
        data.andWhere("cr.id = :uid", { uid: user.id });

        if (take) data.take(take).skip(take * (page - 1))

        const dataRes = await data.orderBy("exp.date", orderby).getMany();
        if (dataRes.length == 0) throw new NotFoundException(DataErrorID.FilterNotFound)
        return dataRes
    }

    async getExpenseTransactionsById(id: number, user: User): Promise<ExpenseTransaction> {
        const data = await this.getQueryExpenseTrans()
            .where("exp.id = :did", { did: id })
            .getOne()
        if (data.created_by.id != user.id) throw new ForbiddenException(DataErrorID.Forbidden);
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        return data;
    } //!BUGGED CANNOT READ PROPERTIES OF UNDEFINED ID

    async getIncomeTransactionsById(id: number, user: User): Promise<IncomeTransaction> {
        const data = await this.getQueryIncomeTrans()
            .where("inc.id = :did", { did: id })
            .getOne()
        if (data.created_by.id != user.id) throw new ForbiddenException(DataErrorID.Forbidden);
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        return data;
    }

    async getExpenseTransactionsByCategory(categoryId: ExpenseCategory, date: Date): Promise<ExpenseTransaction[]> {
        const transactions = await this.getQueryExpenseTrans()
            .where("cat.id = :cid", { cid: categoryId })
            .andWhere("exp.date >= :sd", { sd: getDateStartMonth(date) })
            .andWhere("exp.date <= :ed", { ed: getDateEndMonth(date) })
            .getMany();
        return transactions
    }

    async getIncomeTransactionsByCategory(categoryId: IncomeCategory, date: Date): Promise<IncomeTransaction[]> {
        const transactions = await this.getQueryIncomeTrans()
            .where("cat.id = :cid", { cid: categoryId })
            .andWhere("inc.date >= :sd", { sd: getDateStartMonth(date) })
            .andWhere("inc.date <= :ed", { ed: getDateEndMonth(date) })
            .getMany();
        return transactions
    }


    async addExpenseTransactions(user: User, dto: AddExpTransactionDto, ip: string) {
        let newData = this.exTransRepo.create({
            ...dto,
            created_by: user,
        })
        let hasBudget: boolean = false
        let budgetAlmostLimit: boolean = false
        let budgetOverLimit: boolean = false
        let percentage: number | null
        let accAmount: number = 0;

        try {
            const currMonth: Date = getDateStartMonth(dto.date)
            //find budget
            const budget = await this.budgetService.getMonthlyBudgetByCategory(dto.category, currMonth);
            //get past transactions
            const pastTrans = await this.getExpenseTransactionsByCategory(dto.category, dto.date);

            if (pastTrans.length != 0) {
                accAmount = this.getAccumulatedTransactions(pastTrans)
            }

            if (budget) {
                hasBudget = true;
                percentage = this.getExpenseDiffPercentage(budget, accAmount)
                if (percentage > 75) budgetAlmostLimit = true;
                if (percentage >= 100) budgetOverLimit = true;
            }

            if (dto.wallet) await this.walletService.subsWalletAmount(dto.wallet, dto.amount)

            newData = await this.exTransRepo.save(newData);
            return { message: DataSuccessID.DataAdded, budgetAlmostLimit, hasBudget, percentage, budgetOverLimit }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async addIncomeTransactions(user: User, dto: AddIncTransactionDto, ip: string) {
        let newData = this.inTransRepo.create({
            ...dto,
            created_by: user
        });
        let hasFulfilled: boolean = false;
        let hasEstimation: boolean = false;
        const currMonth: Date = getDateStartMonth(dto.date)
        let accAmount: number = 0;
        let percentage: number
        try {
            const estimation = await this.incEstimationService.getMonthEstimationByCategory(dto.category, currMonth);
            const pastTrans = await this.getIncomeTransactionsByCategory(dto.category, currMonth)
            if (pastTrans.length != 0) {
                accAmount = this.getAccumulatedTransactions(pastTrans)
            }
            if (estimation) {
                hasEstimation = true;
                percentage = this.getIncomeDiffPercentage(estimation, accAmount)
            }
            if (dto.wallet) await this.walletService.addWalletAmount(dto.wallet, dto.amount)

            newData = await this.inTransRepo.save(newData);
            return { message: DataSuccessID.DataAdded, hasEstimation, hasFulfilled, percentage }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    // ! ADD LOG IN ADD

    async editExpense(expId: number, user: User, dto: EditTransactionsDto, ip: string) {
        const expense = await this.exTransRepo.findOne({ where: { id: expId } })
        if (!expense) throw new NotFoundException(DataErrorID.NotFound)
        if (dto.amount !== expense.amount) {
            //check wallet
            const wallet = expense.wallet
            if (wallet) {
                const amountDiff = Math.abs(dto.amount - expense.amount);
                if (dto.amount > expense.amount) {
                    await this.walletService.subsWalletAmount(wallet.id, amountDiff)
                } else if (dto.amount < expense.amount) {
                    await this.walletService.addWalletAmount(wallet.id, amountDiff)
                }
            }
        }

        try {
            await this.exTransRepo.update(expId, {
                ...dto
            })
            await this.logService.addLog("Update expense transaction data", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataUpdated }
        } catch (error) {
            await this.logService.addLog("Failed to update expense data", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(error)
        }
    }

    async editIncome(incId: number, user: User, dto: EditTransactionsDto, ip: string) {
        const income = await this.inTransRepo.findOne({ where: { id: incId } })
        if (!income) throw new NotFoundException(DataErrorID.NotFound)
        if (dto.amount !== income.amount) {
            const wallet = income.wallet;
            if (wallet) {
                const amountDiff = Math.abs(dto.amount - income.amount);
                if (dto.amount > income.amount) {
                    await this.walletService.subsWalletAmount(wallet.id, amountDiff)
                } else if (dto.amount < income.amount) {
                    await this.walletService.addWalletAmount(wallet.id, amountDiff)
                }
            }
        }

        try {
            await this.inTransRepo.update(incId, {
                ...dto
            })
            await this.logService.addLog("Edit income transaction data", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataUpdated }
        } catch (error) {
            await this.logService.addLog("Failed to update income data", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(error)
        }
    }

    async hardDeleteExpense(id: number, user: User, ip: string) {
        const data = await this.exTransRepo.findOne({ where: { id: id } })
        if (!data) throw new NotFoundException(DataErrorID.NotFound);
        try {
            if (data.wallet) {
                await this.walletService.addWalletAmount(data.wallet.id, data.amount)
            }
            await this.exTransRepo.delete(id);
            await this.logService.addLog("Deleted expense", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataHardDeleted }
        } catch (error) {
            await this.logService.addLog("Failed to delete expense", thisModule, LogType.Failure, ip, user.id);
            throw new InternalServerErrorException(error)
        }
    }

    async hardDeleteIncome(id: number, user: User, ip: string) {
        const data = await this.inTransRepo.findOne({ where: { id: id } })
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        try {
            if (data.wallet) {
                await this.walletService.subsWalletAmount(data.wallet.id, data.amount)
            }
            await this.inTransRepo.delete(id);
            await this.logService.addLog("Deleted income", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataHardDeleted }
        } catch (error) {
            await this.logService.addLog("Failed to delete income", thisModule, LogType.Failure, ip, user.id);
            throw new InternalServerErrorException(error)
        }
    }

    getAccumulatedTransactions(transactions: ExpenseTransaction[] | IncomeTransaction[]): number {
        let total: number = 0;
        transactions.map((trans: ExpenseTransaction | IncomeTransaction) => {
            total += Number(trans.amount)
        })
        return total;
    }

    getExpenseDiffPercentage(budget: Budget, transAmount: number) {
        return (transAmount / budget.amount) * 100
    }

    getIncomeDiffPercentage(estimation: IncomeEstimation, transAmount: number) {
        return (transAmount / estimation.amount) * 100;
    }



}
