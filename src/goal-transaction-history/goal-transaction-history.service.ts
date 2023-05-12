import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinanceGoal } from 'src/finance-goal/entities/finance-goal.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FinanceGoalHistory } from './entities/finance-goal-history.entity';
import * as moment from "moment"
import { User } from 'src/user/entities/user.entity';
import { DataErrorID } from 'src/utils/global/enum/error-message.enum';
import { AddSavingDto } from 'src/finance-goal/dto/add-saving.dto';

@Injectable()
export class GoalTransactionHistoryService {
    constructor(
        @InjectRepository(FinanceGoalHistory)
        private goalHistoryRepo: Repository<FinanceGoalHistory>,
    ) { }


    getQueryGoalHistory(): SelectQueryBuilder<FinanceGoalHistory> {
        const query = this.goalHistoryRepo.createQueryBuilder("history")
            .innerJoin("history.goal", "goal")
            .leftJoin("history.created_by", "cr")
            .select([
                "history.id", "history.amount", "history.title", "history.date", "history.created_at",
                // "goal.id", "goal.title", 
                "cr.id", "cr.email",
            ])
        return query
    }

    async getAllHistoryByGoal(goalId: number, user: User) {
        const data = await this.getQueryGoalHistory()
            .where("goal.id = :gid", { gid: goalId })
            .andWhere("cr.id = :uid", { uid: user.id })
            .getMany()
        return data;
    }

    async getHistoryById(id: number, user: User) {
        const data = await this.getQueryGoalHistory()
            .where("history.id = :hid", { hid: id })
            .andWhere("cr.id = :uid", { uid: user.id })
            .getOne()
        if (!data) throw new NotFoundException(DataErrorID.NotFound)
        return data;
    }

    async checkHistoryInMonth(goalId: number, user: User, date: Date) {
        const data = await this.getQueryGoalHistory()
            .where("MONTH(history.created_at) = :m", { m: moment(date).format("MM") })
            .andWhere("goal.id = :gid", { gid: goalId })
            .andWhere("cr.id = :uid", { uid: user.id })
            .getMany()
        // console.log({ data, month: moment(date).format("MM") });
        return data.length
    }

    async createGoalHistory(goal: FinanceGoal, dto: AddSavingDto, user: User) {
        let newData = this.goalHistoryRepo.create({ goal, ...dto, created_by: user })
        try {
            newData = await this.goalHistoryRepo.save(newData);
            return;
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
