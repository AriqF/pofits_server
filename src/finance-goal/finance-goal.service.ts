import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinanceGoal } from './entities/finance-goal.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { WeblogService } from 'src/weblog/weblog.service';
import { User } from 'src/user/entities/user.entity';
import { DataErrorID } from 'src/utils/global/enum/error-message.enum';
import { AddGoalDto } from './dto/add-goal.dto';
import { LogType } from 'src/weblog/interfaces/log-type.enum';
import { DataSuccessID } from 'src/utils/global/enum/success-message.enum';
import { EditGoalDto } from './dto/edit-goal.dto';
import { EditGoalStatusDto } from './dto/edit-status.dto';
import { AddSavingDto } from './dto/add-saving.dto';
import { GoalFilterDto } from './dto/goal-filter.dto';
import { GoalResponse } from './interfaces/goal-response';
import { FinanceGoalHistory } from '../goal-transaction-history/entities/finance-goal-history.entity';
import * as moment from "moment"
import { GoalTransactionHistoryService } from 'src/goal-transaction-history/goal-transaction-history.service';

const thisModule = "Finance Goal"

@Injectable()
export class FinanceGoalService {
    constructor(
        @InjectRepository(FinanceGoal)
        private goalRepo: Repository<FinanceGoal>,
        private goalHistoryService: GoalTransactionHistoryService,
        private readonly logService: WeblogService,
    ) { }

    getQueryGoal(): SelectQueryBuilder<FinanceGoal> {
        const query = this.goalRepo.createQueryBuilder("goal")
            .leftJoin("goal.created_by", "cr")
            .leftJoin("goal.wallet", "wallet")
            .select([
                "goal.id", "goal.title", "goal.amount_target", "goal.amount_reached", "goal.isFlexible",
                "goal.frequencies", "goal.amount_per_frequency", "goal.timebound", "goal.isAchieved",
                "goal.priority", "goal.created_at", "goal.updated_at", "goal.deleted_at",
                "wallet.id", "wallet.name", "wallet.amount", "wallet.icon",
                "cr.id", "cr.email",
            ])
        return query
    }

    async findAllUserGoals(user: User): Promise<GoalResponse[]> {
        const data = await this.getQueryGoal()
            .where("cr.id = :uid", { uid: user.id })
            .orderBy("goal.isAchieved", "ASC")
            .addOrderBy("goal.priority", "DESC")
            .getMany();
        let goalResponses: GoalResponse[] = []
        for (const item of data) {
            goalResponses.push(await this.convertToGoalResponse(item))
        }
        return goalResponses
    }

    async findAllUserGoalsByFilter(user: User, filter: GoalFilterDto): Promise<GoalResponse[]> {
        let { search, order, achieved, take, page } = filter;
        if (!order) order = "ASC";
        if (!page) page = 1
        let data = this.getQueryGoal()
        if (search) {
            data.where("goal.title LIKE :src", { src: `%${search}%` })
        }
        if (achieved !== undefined) {
            data.andWhere("goal.isAchieved = :val", { val: achieved })
        }
        data.andWhere("cr.id = :uid", { uid: user.id })
        if (take) {
            data.take(take)
            data.skip(take * (page - 1))
        }
        const dataRes = await data
            .orderBy("goal.priority", "DESC")
            .addOrderBy("goal.isAchieved", "DESC")
            .getMany();
        // console.log(dataRes)
        let goalResponses: GoalResponse[] = []
        for (const item of dataRes) {
            goalResponses.push(await this.convertToGoalResponse(item))
        }
        return goalResponses
    }

    async findGoalById(id: number, user: User): Promise<GoalResponse> {
        const data = await this.getQueryGoal()
            .where("goal.id = :gid", { gid: id })
            .andWhere("cr.id = :uid", { uid: user.id })
            .getOne()
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        return this.convertToGoalResponse(data);
    }

    async addGoal(dto: AddGoalDto, user: User, ip: string): Promise<Object> {
        let newData = this.goalRepo.create({ ...dto, created_by: user })
        try {
            newData = await this.goalRepo.save(newData);
            let log: string;
            log = "Added a finance goal";
            await this.logService.addLog(log, thisModule, LogType.Info, ip, user.id);
            return {
                message: DataSuccessID.DataAdded
            }
        } catch (error) {
            await this.logService.addLog("Failed to add finance goal", thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(error)
        }
    }

    async editGoal(id: number, dto: EditGoalDto, user: User, ip: string): Promise<Object> {
        const goal = await this.findGoalById(id, user);

        try {
            await this.goalRepo.update(id, { ...dto })
            await this.logService.addLog("Edited a goal", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataUpdated }
        } catch (error) {
            await this.logService.addLog("Failed to edit goal: " + String(error), thisModule, LogType.Failure, ip, user.id)
            if (error === BadRequestException) {
                throw new BadRequestException(error)
            } else if (error === ForbiddenException) {
                throw new ForbiddenException(error)
            }
            throw new error
        }
    }

    async deleteGoal(id: number, user: User, ip: string): Promise<Object> {
        const goal = await this.findGoalById(id, user);
        try {
            await this.goalRepo.delete(id)
            await this.logService.addLog("Deleted a goal", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataDeleted }
        } catch (error) {
            await this.logService.addLog("Failed to delete goal: " + String(error), thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException(error)
        }
    }

    async addSavingToGoal(goalId: number, dto: AddSavingDto, user: User, ip: string) {
        const goal = await this.findGoalById(goalId, user);
        try {
            await this.goalHistoryService.createGoalHistory(goal, dto, user)
            await this.goalRepo.update(goalId, {
                amount_reached: Number(goal.amount_reached) + Number(dto.amount)
            })
            return { message: "Berhasil menambahkan nominal" }
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async markGoalAchieved(goalId: number, user: User) {
        await this.findGoalById(goalId, user);
        try {
            await this.goalRepo.update(goalId, { isAchieved: true })
            return {
                message: "Tujuan berhasil diselesaikan"
            }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async convertToGoalResponse(goal: FinanceGoal): Promise<GoalResponse> {
        const currDate = new Date()
        const currMonHistories: number = await this.goalHistoryService.checkHistoryInMonth(goal.id, goal.created_by, currDate)
        let timesToSave = (goal.amount_target - goal.amount_reached) / goal.amount_per_frequency;
        const daysToGo = timesToSave * goal.frequencies;
        if (currMonHistories >= 1) {
            timesToSave += 1
        }
        const estimatedDate = new Date(currDate.setDate(currDate.getDate() + daysToGo))
        let amountsToSaveLeft = timesToSave * goal.amount_per_frequency;
        if (amountsToSaveLeft < 0) amountsToSaveLeft = 0;
        if (timesToSave < 0) timesToSave = 0;
        let percentage = (goal.amount_reached / goal.amount_target) * 100;
        if (percentage > 100) percentage = 100
        // console.log({ daysToGo })
        // console.log({
        //     f: goal.frequencies,
        //     am: goal.amount_target,
        //     af: goal.amount_per_frequency,
        //     ar: goal.amount_reached,
        //     currDate: new Date(),
        //     daysToGo, timesToSave, estDate: new Date(currDate.setDate(currDate.getDate() + daysToGo))
        // })
        return {
            ...goal, estimated_achieved: estimatedDate, times_to_save_left: Math.round(timesToSave),
            amounts_to_save_left: amountsToSaveLeft, percentage: Number(percentage.toFixed(2)), days_to_go: daysToGo < 0 ? 0 : Math.round(daysToGo)
        }
    }

    dateDiff(date1: Date, date2: Date): number {
        return Math.floor((Date.parse(date2.toString()) - Date.parse(date1.toString())) / 86400000)
    }


}
