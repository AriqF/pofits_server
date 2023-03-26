import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { ExpenseCategory } from 'src/expense-category/entities/expense-category.entity';
import { User } from 'src/user/entities/user.entity';
import { DataErrorID } from 'src/utils/global/enum/error-message.enum';
import { DataSuccessID } from 'src/utils/global/enum/success-message.enum';
import { convertStartEndDateFmt, formatMonthNumber, getDaysInMonth, getListMonthDifferenece, getMonthDifference, getStartEndDateFmt, validateMoreThanDate } from 'src/utils/helper';
import { LogType } from 'src/weblog/interfaces/log-type.enum';
import { WeblogService } from 'src/weblog/weblog.service';
import { Between, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { BudgetFilterDto } from './dto/filter-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';

const thisModule = "Budget"

@Injectable()
export class BudgetService {
    constructor(
        @InjectRepository(Budget)
        private budgetRepo: Repository<Budget>,
        private logService: WeblogService,
    ) { }

    getQueryBudget(): SelectQueryBuilder<Budget> {
        const query = this.budgetRepo.createQueryBuilder("budget")
            .leftJoin("budget.created_by", "cr")
            .leftJoin("budget.category", "cat")
            .select([
                "budget.id", "budget.amount", "budget.start_date", "budget.end_date",
                "budget.isRepeat", "budget.created_at", "budget.updated_at", "budget.deleted_at",
                "cat.id", "cat.title", "cat.icon", "cr.id", "cr.email", "cr.username",
            ])
        return query
    }

    //!CONVERT INTO PROCESSED BUDGET

    async findAllUserBudget(userId: number): Promise<Budget[]> {
        const data = await this.getQueryBudget()
            .where("cr.id = :uid", { uid: userId })
            .getMany();
        // if (data.length == 0) throw new NotFoundException(DataErrorID.NotFound)
        return data;
    }

    async findById(id: number, user: User): Promise<Budget> {
        const data = await this.getQueryBudget()
            .where("budget.id = :bid", { bid: id })
            // .andWhere("cr.id = :uid", { uid: user.id })
            .getOne()
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        if (data.created_by.id != user.id) throw new ForbiddenException(DataErrorID.Forbidden)
        return data
    }

    async findAllUserBudgetFilter(userId: number, filter: BudgetFilterDto): Promise<Budget[]> {
        let { month } = filter;
        let searchDate = new Date(moment(month).startOf("month").format("YYYY-MM-DD"))
        const budgets = await this.getQueryBudget()
            .where("cr.id = :uid", { uid: userId })
            .andWhere("budget.start_date = :val", { val: searchDate })
            .getMany();
        // if (budgets.length == 0) throw new NotFoundException(DataErrorID.FilterNotFound)
        return budgets
    }

    async getOneById(id: number): Promise<Budget> {
        return this.budgetRepo.findOne({ where: { id: id } })
    }

    async getMonthlyBudgetByCategory(cid: number | ExpenseCategory, date: Date): Promise<Budget> {
        const budget = await this.getQueryBudget()
            .where("cat.id = :id", { id: cid })
            .andWhere("budget.start_date = :sd", { sd: date })
            .getOne();
        return budget
    }

    async addBudget(createDto: CreateBudgetDto, user: User, ip: string): Promise<Object> {
        let { start_date, end_date, isRepeat, category } = createDto

        if (isRepeat && !end_date) {
            throw new BadRequestException("Bulan berakhir tidak boleh kosong jika pengeluaran berulang!")
        }

        if (isRepeat && end_date) {
            if (!validateMoreThanDate(start_date, end_date)) {
                throw new BadRequestException("Bulan berakhir tidak boleh kurang dari bulan awal")
            }
        }

        let [startDateFmt, endDateFmt] = convertStartEndDateFmt(start_date, end_date, isRepeat)

        //validate if budget category this month is exist
        if (!(await this.validateCurrentMonthBudget(user.id, category, startDateFmt, endDateFmt))) {
            throw new ConflictException("Kategori ini sudah memiliki budget pada periode ini")
        }

        try {
            const sDateList = getListMonthDifferenece(startDateFmt, endDateFmt);
            sDateList.forEach(async (valDate) => {
                let endDate = new Date(moment(valDate).endOf("month").format("YYYY-MM-DD"));
                let newData = this.budgetRepo.create({
                    start_date: valDate,
                    end_date: endDate,
                    category, isRepeat,
                    amount: createDto.amount,
                    created_by: user
                });
                await this.budgetRepo.save(newData);
            })

            await this.logService.addLog("Added a budget", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataAdded }
        } catch (error) {
            await this.logService.addLog("Failed to add budget", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(error)
        }
    }


    async validateCurrentMonthBudget(userId: number, category: ExpenseCategory, startDate: Date, endDate: Date): Promise<boolean> {
        const findData: Budget = await this.getQueryBudget()
            .where("cr.id = :uid", { uid: userId })
            .andWhere("cat.id = :cid", { cid: category })
            .andWhere("budget.start_date >= :vs", { vs: moment(startDate).startOf("month").format('YYYY-MM-DD') })
            .andWhere("budget.end_date <= :ve", { ve: moment(endDate).endOf("month").format('YYYY-MM-DD') })
            .getOne()
        if (findData) return false
        return true
    }

    async editBudget(budgetId: number, user: User, dto: UpdateBudgetDto, ip: string): Promise<Object> {
        const findBudget = await this.budgetRepo.findOne({ where: { id: budgetId } })
        if (!findBudget) throw new NotFoundException(DataErrorID.NotFound)
        if (findBudget.created_by.id != user.id) throw new ForbiddenException(DataErrorID.Forbidden)

        try {
            await this.budgetRepo.update(budgetId, {
                ...dto
            })
            await this.logService.addLog("Updated a budget", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataUpdated }
        } catch (error) {
            await this.logService.addLog("Failed to update budget", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(error)
        }
    }

    async softDeleteBudgetById(budgetId: number, user: User, ip: string) {
        const findBudget = await this.budgetRepo.findOne({ where: { id: budgetId } })
        if (!findBudget) throw new NotFoundException(DataErrorID.NotFound)
        if (findBudget.created_by.id != user.id) throw new ConflictException(DataErrorID.Forbidden)

        try {
            await this.budgetRepo.softDelete(budgetId);
            await this.logService.addLog("Soft deleted a budget", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataDeleted }
        } catch (error) {
            await this.logService.addLog("Failed to soft delete a budget", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(error)
        }
    }

    async hardDeleteBudgetById(budgetId: number, user: User, ip: string) {
        const findBudget = await this.budgetRepo.findOne({ where: { id: budgetId }, withDeleted: true })
        if (!findBudget) throw new NotFoundException(DataErrorID.NotFound)
        if (findBudget.created_by.id != user.id) throw new ConflictException(DataErrorID.Forbidden)

        try {
            await this.budgetRepo.delete(budgetId);
            await this.logService.addLog("Permanently deleted a budget", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataHardDeleted }
        } catch (error) {
            await this.logService.addLog("Failed to delete a budget permanently", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(error)
        }
    }

    async getPercentageBudgetUsed(budgetId: number) {
        const budget = await this.budgetRepo.findOne({ where: { id: budgetId } });

    }

    // !CREATE TRANSACTION SERVICE FIRST
    convertToProcessedBudget(data: Budget) { }
}
