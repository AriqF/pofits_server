import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/interfaces/role.enum';
import { DataErrorID } from 'src/utils/global/enum/error-message.enum';
import { DataSuccessID } from 'src/utils/global/enum/success-message.enum';
import { LogType } from 'src/weblog/interfaces/log-type.enum';
import { WeblogService } from 'src/weblog/weblog.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateIncCatDto } from './dto/create-income-category.dto';
import { UpdateIncCatDto } from './dto/update-income-category.dto';
import { IncomeCategory } from './entity/income-category.entity';

const thisModule = "Income Category";

@Injectable()
export class IncomeCategoryService {
    constructor(
        @InjectRepository(IncomeCategory)
        private incatRepo: Repository<IncomeCategory>,
        private readonly logService: WeblogService,
    ) { }


    getQueryInCat(): SelectQueryBuilder<IncomeCategory> {
        const query = this.incatRepo.createQueryBuilder('inc')
            .leftJoin('inc.created_by', 'cr')
            .select([
                'inc.id', 'inc.title', 'inc.description', 'inc.income_type',
                'inc.isGlobal', 'inc.created_at', 'inc.updated_at', 'inc.deleted_at',
                'cr.id', 'cr.username', 'cr.email'
            ])
        return query
    }

    async findAllByUser(userId: number): Promise<IncomeCategory[]> {
        const userCategories = await this.getQueryInCat()
            .where("cr.id = :uid", { uid: userId })
            .orWhere("inc.isGlobal = :vl", { vl: true })
            .orderBy("isGlobal", "DESC")
            .getMany();
        if (userCategories.length == 0) throw new NotFoundException(DataErrorID.NotFound)
        return userCategories
    }

    async findAllGlobal(): Promise<IncomeCategory[]> {
        const categories = await this.getQueryInCat()
            .where("inc.isGlobal = :vl", { vl: true })
            .getMany()
        if (categories.length == 0) throw new NotFoundException(DataErrorID.NotFound)
        return categories
    }

    async findOneById(id: number): Promise<IncomeCategory> {
        const category = await this.getQueryInCat()
            .where("inc.id = :vl", { vl: id })
            .getOne();
        if (!category) throw new NotFoundException(DataErrorID.NotFound)
        return category
    }

    async addCategory(addDto: CreateIncCatDto, isGlobal: boolean, user: User, ip: string): Promise<Object> {
        let newData = this.incatRepo.create({
            ...addDto,
            created_by: user,
            isGlobal
        })
        try {
            newData = await this.incatRepo.save(newData);
            let log: string;
            if (isGlobal) {
                log = "Added a global income category"
            } else {
                log = "Added a user customized income category"
            }
            await this.logService.addLog(log, thisModule, LogType.Info, ip, user.id)
            return {
                message: DataSuccessID.DataAdded
            }
        } catch (error) {
            await this.logService.addLog("Failed to add income category", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(DataErrorID.AddFailed)
        }
    }

    async updateCategory(id: number, updDto: UpdateIncCatDto, user: User, ip: string): Promise<Object> {
        const data = await this.incatRepo.findOne({ where: { id } })
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        if (data.isGlobal && user.role != Role.Admin) throw new ForbiddenException(DataErrorID.Forbidden)
        try {
            await this.incatRepo.update(id, { ...updDto })
            let log: string;
            if (data.isGlobal) {
                log = "Updated a global income category"
            } else {
                log = "Updated an income category"
            }
            await this.logService.addLog(log, thisModule, LogType.Info, ip, user.id);
            return { message: DataSuccessID.DataUpdated }
        } catch (error) {
            let log: string;
            if (data.isGlobal) {
                log = "Failed to update a global income category"
            } else {
                log = "Failed to update an income category"
            }
            await this.logService.addLog(log, thisModule, LogType.Failure, ip, user.id);
            throw new InternalServerErrorException(DataErrorID.UpdateFailed)
        }
    }

    async softDelete(id: number, user: User, ip: string): Promise<Object> {
        const data = await this.incatRepo.findOne({ where: { id } })
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        if (data.isGlobal && user.role != Role.Admin) throw new ForbiddenException(DataErrorID.Forbidden)

        try {
            await this.incatRepo.softDelete(id)
            await this.logService.addLog("Soft deleted an income category", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataDeleted }
        } catch (error) {
            await this.logService.addLog("Failed to soft delete an income category", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(DataErrorID.DeleteFailed)
        }
    }

    async hardDelete(id: number, user: User, ip: string): Promise<Object> {
        const data = await this.incatRepo.findOne({ where: { id }, withDeleted: true })
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        if (data.isGlobal && user.role != Role.Admin) throw new ForbiddenException(DataErrorID.Forbidden)

        try {
            await this.incatRepo.delete(id)
            await this.logService.addLog("Permanently deleted income category", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataHardDeleted }
        } catch (error) {
            await this.logService.addLog("Failed to delete income category", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(DataErrorID.DeleteFailed)
        }
    }
}
