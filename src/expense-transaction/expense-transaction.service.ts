import { ForbiddenException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BudgetService } from 'src/budget/budget.service';
import { ExpenseCategory } from 'src/expense-category/entities/expense-category.entity';
import { EditTransactionsDto } from 'src/transaction/dto/edit/edit-transactions.dto';
import { TransactionsFilterDto } from 'src/transaction/dto/transactions-filter.dto';
import { ExpenseTransaction } from 'src/expense-transaction/entities/expense-transaction.entity';
import { getAccumulatedTransactions, getExpenseDiffPercentage } from 'src/transaction/helper';
import { User } from 'src/user/entities/user.entity';
import { DataErrorID } from 'src/utils/global/enum/error-message.enum';
import { DataSuccessID } from 'src/utils/global/enum/success-message.enum';
import { getDateStartMonth, getDateEndMonth } from 'src/utils/helper';
import { WalletService } from 'src/wallet/wallet.service';
import { LogType } from 'src/weblog/interfaces/log-type.enum';
import { WeblogService } from 'src/weblog/weblog.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AddExpTransactionDto } from './dto/add-exp-transaction.dto';
import * as moment from "moment"

const thisModule = "Transactions"

@Injectable()
export class ExpenseTransactionService {
    constructor(
        @InjectRepository(ExpenseTransaction)
        private expenseRepo: Repository<ExpenseTransaction>,
        private logService: WeblogService,
        private walletService: WalletService,
        @Inject(forwardRef(() => BudgetService))
        private readonly budgetService: BudgetService,
    ) { }

    getQueryExpenseTrans(): SelectQueryBuilder<ExpenseTransaction> {
        const query = this.expenseRepo.createQueryBuilder("exp")
            .leftJoin("exp.category", "cat")
            .leftJoin("exp.wallet", "wal")
            .leftJoin("exp.created_by", "cr")
            .select([
                "exp.id", "exp.amount", "exp.category", "exp.date", "exp.title",
                "exp.description", "exp.created_at", "exp.updated_at", "exp.deleted_at",
                "cat.id", "cat.title", "cat.icon", "wal.id", "wal.name", "wal.amount", "wal.icon", "cr.id", "cr.email",
                "cr.username",
            ])
        return query;
    }

    async getAllUserExpenseTransactions(user: User): Promise<ExpenseTransaction[]> {
        const data = await this.getQueryExpenseTrans()
            .where("cr.id = :uid", { uid: user.id })
            .orderBy("exp.date", "DESC")
            .getMany()
        if (data.length == 0) throw new NotFoundException(DataErrorID.NotFound)
        return data;
    }



    async getAllExpTransactionsByFilter(user: User, dto: TransactionsFilterDto) {
        let { search, start_date, end_date, page, take, orderby } = dto;
        if (!page) page = 1
        if (!end_date) {
            end_date = start_date
        }
        if (!orderby) orderby = "ASC"
        let data = this.getQueryExpenseTrans()
        if (search) data.where("exp.title LIKE :src", { src: `%${search}%` })
        if (start_date && end_date) {
            data.andWhere("exp.date >= :dt", { dt: moment(start_date).format("YYYY-MM-DD") })
            data.andWhere("exp.date <= :et", { et: moment(end_date).format("YYYY-MM-DD") })
        }

        data.andWhere("cr.id = :uid", { uid: user.id });

        if (take) data.take(take).skip(take * (page - 1))

        const dataRes = await data.orderBy("exp.date", orderby).getMany();
        // if (dataRes.length == 0) throw new NotFoundException(DataErrorID.FilterNotFound)
        return dataRes
    }



    async getExpenseTransactionsById(id: number, user: User): Promise<ExpenseTransaction> {
        const data = await this.getQueryExpenseTrans()
            .where("exp.id = :did", { did: id })
            .getOne()
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        if (data.created_by.id != user.id) throw new ForbiddenException(DataErrorID.Forbidden);
        return data;
    }



    async getExpenseTransactionsByCategory(categoryId: ExpenseCategory | number, date: Date, user: User): Promise<ExpenseTransaction[]> {
        const transactions = await this.getQueryExpenseTrans()
            .where("cat.id = :cid", { cid: categoryId })
            .andWhere("cr.id = :uid", { uid: user.id })
            .andWhere("exp.date >= :sd", { sd: getDateStartMonth(date) })
            .andWhere("exp.date <= :ed", { ed: getDateEndMonth(date) })
            .getMany();
        return transactions
    }



    async addExpenseTransactions(user: User, dto: AddExpTransactionDto, ip: string) {
        const queryRunner = this.expenseRepo.queryRunner;
        await queryRunner.connect()
        await queryRunner.startTransaction()
        let newData = this.expenseRepo.create({
            ...dto,
            created_by: user,
        })
        let hasBudget: boolean = false
        let budgetAlmostLimit: boolean = false
        let budgetOverLimit: boolean = false
        let percentage: number = 0
        let accAmount: number = 0;

        try {
            if (dto.wallet) await this.walletService.subsWalletAmount(dto.wallet, dto.amount)

            newData = await this.expenseRepo.save(newData);
            const currMonth: Date = getDateStartMonth(dto.date)
            //find budget
            const budget = await this.budgetService.getMonthlyBudgetByCategory(dto.category, currMonth);
            //get past transactions
            const pastTrans = await this.getExpenseTransactionsByCategory(dto.category, dto.date, user);
            if (pastTrans.length != 0) {
                accAmount = getAccumulatedTransactions(pastTrans)
                if (budget) {
                    percentage = (accAmount / budget.amount) * 100
                }
            }

            if (budget) {
                hasBudget = true;
                if (percentage > 75) budgetAlmostLimit = true;
                if (percentage >= 100) budgetOverLimit = true;
            }
            await queryRunner.startTransaction()
            return { message: DataSuccessID.DataAdded, budgetAlmostLimit, hasBudget, percentage, budgetOverLimit }
        } catch (error) {
            throw new InternalServerErrorException(error)
        } finally {
            await queryRunner.release()
        }
    }

    async editExpense(expId: number, user: User, dto: EditTransactionsDto, ip: string) {
        const expense = await this.expenseRepo.findOne({ where: { id: expId } })
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
            await this.expenseRepo.update(expId, {
                ...dto
            })
            await this.logService.addLog("Update expense transaction data", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataUpdated }
        } catch (error) {
            await this.logService.addLog("Failed to update expense data", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(error)
        }
    }



    async hardDeleteExpense(id: number, user: User, ip: string) {
        const data = await this.expenseRepo.findOne({ where: { id: id } })
        if (!data) throw new NotFoundException(DataErrorID.NotFound);
        try {
            if (data.wallet) {
                await this.walletService.addWalletAmount(data.wallet.id, data.amount)
            }
            await this.expenseRepo.delete(id);
            await this.logService.addLog("Deleted expense", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataHardDeleted }
        } catch (error) {
            await this.logService.addLog("Failed to delete expense", thisModule, LogType.Failure, ip, user.id);
            throw new InternalServerErrorException(error)
        }
    }
}
