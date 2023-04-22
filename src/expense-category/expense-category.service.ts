import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ForbiddenException, InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/interfaces/role.enum';
import { DataErrorID } from 'src/utils/global/enum/error-message.enum';
import { DataSuccessID } from 'src/utils/global/enum/success-message.enum';
import { LogType } from 'src/weblog/interfaces/log-type.enum';
import { WeblogService } from 'src/weblog/weblog.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateExpenseCatDto } from './dto/create-expense-category.dto';
import { UpdateExpCatDto } from './dto/update-expense-category.dto';
import { ExpenseCategory } from './entities/expense-category.entity';
import { generalExpenseCategories } from './helper';

const thisModule = "Expense Category"

@Injectable()
export class ExpenseCategoryService {
    constructor(
        @InjectRepository(ExpenseCategory)
        private expcatRepo: Repository<ExpenseCategory>,
        @Inject(forwardRef(() => WeblogService))
        private readonly logService: WeblogService
    ) { }


    getQueryExpCategory(): SelectQueryBuilder<ExpenseCategory> {
        const query = this.expcatRepo.createQueryBuilder('exp')
            .leftJoin('exp.created_by', 'cr')
            .select([
                'exp.id', 'exp.title', 'exp.description', 'exp.isGlobal', 'exp.created_at', 'exp.updated_at',
                'exp.deleted_at', 'cr.id', 'cr.email', 'cr.username', "exp.icon"
            ])
        return query
    }

    async findAllGlobal(): Promise<ExpenseCategory[]> {
        const data = await this.getQueryExpCategory()
            .where("exp.isGlobal = :val", { val: true })
            .getMany()
        if (data.length == 0) throw new NotFoundException(DataErrorID.NotFound)
        return data;
    }

    async findAllByUser(userId: number): Promise<ExpenseCategory[]> {
        const data = await this.getQueryExpCategory()
            .where("exp.isGlobal = :val", { val: true })
            .orWhere("cr.id = :uid", { uid: userId })
            .orderBy("exp.isGlobal", "ASC")
            .getMany();
        if (data.length == 0) throw new NotFoundException(DataErrorID.NotFound)
        return data
    }

    async findOneById(id: number): Promise<ExpenseCategory> {
        const data = await this.getQueryExpCategory()
            .where("exp.id = :cid", { cid: id })
            .getOne()
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        return data;
    }

    async addCategory(addDto: CreateExpenseCatDto, isGlobal: boolean, user: User, ip: string): Promise<Object> {
        let data = this.expcatRepo.create({
            ...addDto,
            created_by: user,
            isGlobal
        })
        try {
            data = await this.expcatRepo.save(data)
            let log: string
            if (isGlobal) log = "Added a global expense category";
            else log = "Added a user customized expense category "
            await this.logService.addLog(log, thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataAdded }
        } catch (error) {
            await this.logService.addLog("Failed to add expense category", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(DataErrorID.AddFailed,)
        }
    }

    async updateCategory(id: number, user: User, updDto: UpdateExpCatDto, ip: string): Promise<Object> {
        const data = await this.expcatRepo.findOne({ where: { id } })
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        if (data.isGlobal && user.role !== Role.Admin) throw new ForbiddenException(DataErrorID.Forbidden)

        try {
            await this.expcatRepo.update(id, {
                ...updDto
            })
            await this.logService.addLog("Updated expense category", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataUpdated }
        } catch (error) {
            await this.logService.addLog("Failed to update expense category", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(DataErrorID.UpdateFailed)
        }
    }

    async softDeleteById(id: number, user: User, ip: string): Promise<Object> {
        const data = await this.expcatRepo.findOne({ where: { id } })
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        if (data.isGlobal && user.role !== Role.Admin) throw new ForbiddenException(DataErrorID.Forbidden)

        try {
            await this.expcatRepo.softDelete(id)
            await this.logService.addLog("Soft deleted expense category", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataDeleted }
        } catch (error) {
            await this.logService.addLog("Failed to soft delete expense category", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(DataErrorID.DeleteFailed)
        }

    }

    async hardDeleteById(id: number, user: User, ip: string): Promise<Object> {
        const data = await this.expcatRepo.findOne({ where: { id }, withDeleted: true })
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        if (data.isGlobal && user.role !== Role.Admin) throw new ForbiddenException(DataErrorID.Forbidden)

        try {
            await this.expcatRepo.delete(id)
            await this.logService.addLog("Permanently deleted expense category", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataDeleted }
        } catch (error) {
            await this.logService.addLog("Failed to permanently delete expense category", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(DataErrorID.DeleteFailed)
        }
    }

    async generateGeneralCategory(user: User) {
        generalExpenseCategories.forEach(async (category, index) => {
            await this.expcatRepo.insert({
                ...category,
                created_by: user
            })
        })
    }
}
