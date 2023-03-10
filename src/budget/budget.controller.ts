import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Delete, Patch, Query } from '@nestjs/common/decorators';
import { RealIP } from 'nestjs-real-ip';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { BudgetFilterDto } from './dto/filter-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) { }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getAllMyBudget(@GetUser() user: User, @Query() dto: BudgetFilterDto) {
    if (Object.keys(dto).length) {
      return this.budgetService.findAllUserBudgetFilter(user.id, dto)
    }
    return this.budgetService.findAllUserBudget(user.id)
  }

  @Get("dev/:id")
  @UseGuards(JwtAuthGuard)
  devGetBudgetById(@GetUser() user: User, @Param("id") id: number) {
    return this.budgetService.findById(id, user)
  }
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  getBudgetById(@GetUser() user: User, @Param("id") id: number) {
    return this.budgetService.findById(id, user)
  }

  @Post("add")
  @UseGuards(JwtAuthGuard)
  addMonthBudget(@Body() dataDto: CreateBudgetDto, @GetUser() user: User, @RealIP() ip: string) {
    return this.budgetService.addBudget(dataDto, user, ip)
  }

  @Patch("edit/:id")
  @UseGuards(JwtAuthGuard)
  editBudget(@Param("id") id: number, @Body() dto: UpdateBudgetDto, @GetUser() user: User, @RealIP() ip: string) {
    return this.budgetService.editBudget(id, user, dto, ip);
  }

  @Delete("soft-delete/:id")
  @UseGuards(JwtAuthGuard)
  softDeleteBudget(@Param("id") id: number, @GetUser() user: User, @RealIP() ip: string) {
    return this.budgetService.softDeleteBudgetById(id, user, ip)
  }

  @Delete("hard-delete/:id")
  @UseGuards(JwtAuthGuard)
  hardDeleteBudget(@Param("id") id: number, @GetUser() user: User, @RealIP() ip: string) {
    return this.budgetService.hardDeleteBudgetById(id, user, ip)
  }
}
