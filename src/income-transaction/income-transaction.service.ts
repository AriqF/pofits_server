import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BudgetService } from 'src/budget/budget.service';
import { IncomeCategory } from 'src/income-category/entities/income-category.entity';
import { IncomeEstimationService } from 'src/income-estimation/income-estimation.service';
import { EditTransactionsDto } from 'src/transaction/dto/edit/edit-transactions.dto';
import { TransactionsFilterDto } from 'src/transaction/dto/transactions-filter.dto';
import { getAccumulatedTransactions, getIncomeDiffPercentage } from 'src/transaction/helper';
import { User } from 'src/user/entities/user.entity';
import { DataErrorID } from 'src/utils/global/enum/error-message.enum';
import { DataSuccessID } from 'src/utils/global/enum/success-message.enum';
import { getDateEndMonth, getDateStartMonth } from 'src/utils/helper';
import { WalletService } from 'src/wallet/wallet.service';
import { LogType } from 'src/weblog/interfaces/log-type.enum';
import { WeblogService } from 'src/weblog/weblog.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AddIncTransactionDto } from './dto/add-inc-transaction.dto';
import { IncomeTransaction } from './entities/income-transaction.entity';
import { IncomeTransFilterDto } from './dto/filter.dto';

const thisModule = "Transactions";

@Injectable()
export class IncomeTransactionService {
    constructor(
        @InjectRepository(IncomeTransaction)
        private incomeRepo: Repository<IncomeTransaction>,
        private logService: WeblogService,
        @Inject(forwardRef(() => IncomeEstimationService))
        private readonly incEstimationService: IncomeEstimationService,
        private walletService: WalletService,
    ) { }

    getQueryIncomeTrans(): SelectQueryBuilder<IncomeTransaction> {
        const query = this.incomeRepo.createQueryBuilder("inc")
            .leftJoin("inc.category", "cat")
            .leftJoin("inc.wallet", "wal")
            .leftJoin("inc.created_by", "cr")
            .select([
                "inc.id", "inc.amount", "inc.category", "inc.date", "inc.title",
                "inc.description", "inc.created_at", "inc.updated_at", "inc.deleted_at",
                "cat.id", "cat.title", "wal.id", "wal.name", "wal.amount", "cr.id", "cr.email",
                "cr.username", "cat.id", "cat.title", "cat.icon"
            ])
        return query;
    }

    async getAllUserIncomeTransactions(user: User): Promise<IncomeTransaction[]> {
        const data = await this.getQueryIncomeTrans()
            .where("cr.id = :uid", { uid: user.id })
            .orderBy("inc.date", "ASC")
            .getMany()
        // if (data.length == 0) throw new NotFoundException(DataErrorID.NotFound)
        return data;
    }

    async getAllIncTransactionsByFilter(user: User, dto: IncomeTransFilterDto) {
        let { search, date, page, take, orderby, category } = dto;
        if (!page) page = 1

        if (!orderby) orderby = "ASC"
        let data = this.getQueryIncomeTrans()
        if (search) data.where("exp.title LIKE :src", { src: `%${search}%` })

        if (date) data.andWhere("exp.date = :dt", { dt: date })

        if (category) data.andWhere("cat.id = :cid", { cid: category })

        data.andWhere("cr.id = :uid", { uid: user.id });

        if (take) data.take(take).skip(take * (page - 1))

        const dataRes = await data.orderBy("exp.date", orderby).getMany();
        // if (dataRes.length == 0) throw new NotFoundException(DataErrorID.FilterNotFound)
        return dataRes
    }

    async getIncomeTransactionsById(id: number, user: User): Promise<IncomeTransaction> {
        const data = await this.getQueryIncomeTrans()
            .where("inc.id = :did", { did: id })
            .getOne()
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        if (data.created_by.id != user.id) throw new ForbiddenException(DataErrorID.Forbidden);
        return data;
    }

    async getIncomeTransactionsByCategory(categoryId: IncomeCategory | number, date: Date, user: User): Promise<IncomeTransaction[]> {
        const transactions = await this.getQueryIncomeTrans()
            .where("cat.id = :cid", { cid: categoryId })
            .andWhere("cr.id = :uid", { uid: user.id })
            .andWhere("inc.date >= :sd", { sd: getDateStartMonth(date) })
            .andWhere("inc.date <= :ed", { ed: getDateEndMonth(date) })
            .getMany();
        return transactions
    }

    async addIncomeTransactions(user: User, dto: AddIncTransactionDto, ip: string) {
        let newData = this.incomeRepo.create({
            ...dto,
            created_by: user
        });
        let hasFulfilled: boolean = false;
        let hasEstimation: boolean = false;
        const currMonth: Date = getDateStartMonth(dto.date)
        let accAmount: number = 0;
        let percentage: number = 0;
        try {
            newData = await this.incomeRepo.save(newData);
            const estimation = await this.incEstimationService.getMonthEstimationByCategory(dto.category, currMonth);
            const pastTrans = await this.getIncomeTransactionsByCategory(dto.category, dto.date, user)
            if (pastTrans.length != 0) {
                accAmount = getAccumulatedTransactions(pastTrans)
                if (estimation) {
                    percentage = (accAmount / estimation.amount) * 100;
                }
            }
            if (estimation) {
                hasEstimation = true;
            }
            if (dto.wallet) await this.walletService.addWalletAmount(dto.wallet, dto.amount)

            return { message: DataSuccessID.DataAdded, hasEstimation, hasFulfilled, percentage }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async editIncome(incId: number, user: User, dto: EditTransactionsDto, ip: string) {
        const income = await this.incomeRepo.findOne({ where: { id: incId } })
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
            await this.incomeRepo.update(incId, {
                ...dto
            })
            await this.logService.addLog("Edit income transaction data", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataUpdated }
        } catch (error) {
            await this.logService.addLog("Failed to update income data", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(error)
        }
    }

    async hardDeleteIncome(id: number, user: User, ip: string) {
        const data = await this.incomeRepo.findOne({ where: { id: id } })
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        try {
            if (data.wallet) {
                await this.walletService.subsWalletAmount(data.wallet.id, data.amount)
            }
            await this.incomeRepo.delete(id);
            await this.logService.addLog("Deleted income", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataHardDeleted }
        } catch (error) {
            await this.logService.addLog("Failed to delete income", thisModule, LogType.Failure, ip, user.id);
            throw new InternalServerErrorException(error)
        }
    }
}
