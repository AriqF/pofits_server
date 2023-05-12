import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GoalTransactionHistoryService } from './goal-transaction-history.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('finance-goal/transaction-history')
export class GoalTransactionHistoryController {
    constructor(
        private readonly historyService: GoalTransactionHistoryService,
    ) { }

    @Get("all/:goalId")
    @UseGuards(JwtAuthGuard)
    getAllHistory(@GetUser() user: User, @Param("goalId") id: number) {
        return this.historyService.getAllHistoryByGoal(id, user)
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    getHistoryById(@GetUser() user: User, @Param("id") id: number) {
        return this.historyService.getHistoryById(id, user)
    }
}
