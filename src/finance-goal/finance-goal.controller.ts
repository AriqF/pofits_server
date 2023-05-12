import { Body, Controller, Query, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { FinanceGoalService } from './finance-goal.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { AddGoalDto } from './dto/add-goal.dto';
import { RealIP } from 'nestjs-real-ip';
import { EditGoalDto } from './dto/edit-goal.dto';
import { EditGoalStatusDto } from './dto/edit-status.dto';
import { GoalFilterDto } from './dto/goal-filter.dto';
import { AddSavingDto } from './dto/add-saving.dto';

@Controller('finance-goal')
export class FinanceGoalController {
    constructor(
        private goalService: FinanceGoalService
    ) { }

    @Get("all")
    @UseGuards(JwtAuthGuard)
    getAllUserParentGoals(@GetUser() user: User, @Query() filter: GoalFilterDto) {
        if (Object.keys(filter).length) {
            return this.goalService.findAllUserGoalsByFilter(user, filter)
        }
        return this.goalService.findAllUserGoals(user)
    }

    @Get("test-date")
    @UseGuards(JwtAuthGuard)
    testDateDiff() {
        const date1 = new Date("2023-05-08")
        const date2 = new Date("2023-05-08")
        return this.goalService.dateDiff(date1, date2)
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    getGoalById(@Param("id") id: number, @GetUser() user: User) {
        return this.goalService.findGoalById(id, user)
    }

    @Post("add")
    @UseGuards(JwtAuthGuard)
    addGoal(@GetUser() user: User, @Body() dto: AddGoalDto, @RealIP() ip: string) {
        return this.goalService.addGoal(dto, user, ip)
    }

    @Patch("edit/:id")
    @UseGuards(JwtAuthGuard)
    editGoal(@GetUser() user: User, @Param("id") id: number, @Body() dto: EditGoalDto, @RealIP() ip: string) {
        return this.goalService.editGoal(id, dto, user, ip);
    }

    @Patch("add-saving/:id")
    @UseGuards(JwtAuthGuard)
    addSavingToGoal(@GetUser() user: User, @Param("id") id: number, @Body() dto: AddSavingDto, @RealIP() ip: string) {
        return this.goalService.addSavingToGoal(id, dto, user, ip)
    }

    @Patch("mark-achieved/:id")
    @UseGuards(JwtAuthGuard)
    markGoalAsAchieved(@GetUser() user: User, @Param("id") id: number) {
        return this.goalService.markGoalAchieved(id, user);
    }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard)
    deleteGoals(@GetUser() user: User, @Param("id") id: number, @RealIP() ip: string) {
        return this.goalService.deleteGoal(id, user, ip);
    }

}
