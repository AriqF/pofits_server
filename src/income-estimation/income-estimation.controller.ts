import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { IncomeEstimationService } from './income-estimation.service';
import { CreateEstimationDto } from './dto/create-income-estimation.dto';
import { UpdateIncomeEstimationDto } from './dto/update-income-estimation.dto';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { RealIP } from 'nestjs-real-ip';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BudgetFilterDto } from 'src/budget/dto/filter-budget.dto';

@Controller('income-estimation')
export class IncomeEstimationController {
  constructor(private readonly estimationService: IncomeEstimationService) { }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  findAll(@GetUser() user: User, @Query() dto: BudgetFilterDto) {
    if (Object.keys(dto).length) {
      return this.estimationService.findAllEstimationByFilter(user, dto)
    }
    return this.estimationService.findAllUserEstimation(user)
  }

  @Get("/me/month-recap")
  @UseGuards(JwtAuthGuard)
  getTargetMonthRecap(@GetUser() user: User, @Query() dto: BudgetFilterDto) {
    return this.estimationService.getMonthlyRecap(dto, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.estimationService.findOneById(id, user)
  }

  @Post("add")
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateEstimationDto, @GetUser() user: User, @RealIP() ip: string) {
    return this.estimationService.createIncomeEstimation(dto, user, ip)
  }


  @Patch('edit/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() dto: UpdateIncomeEstimationDto, @GetUser() user: User, @RealIP() ip: string) {
    return this.estimationService.editIncomeEstimation(id, user, dto, ip);
  }

  @Delete('soft-delete/:id')
  @UseGuards(JwtAuthGuard)
  softDeleteEstimationById(@Param('id') id: number, @GetUser() user: User, @RealIP() ip: string) {
    return this.estimationService.softDelete(id, user, ip)
  }

  @Delete('hard-delete/:id')
  @UseGuards(JwtAuthGuard)
  hardDeleteEstimationById(@Param('id') id: number, @GetUser() user: User, @RealIP() ip: string) {
    return this.estimationService.hardDelete(id, user, ip)
  }
}
