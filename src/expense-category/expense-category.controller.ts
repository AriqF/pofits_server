import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/role.guard';
import { User } from 'src/user/entities/user.entity';
import { CreateExpenseCatDto } from './dto/create-expense-category.dto';
import { UpdateExpCatDto } from './dto/update-expense-category.dto';
import { ExpenseCategoryService } from './expense-category.service';

@Controller('expense-category')
export class ExpenseCategoryController {
    constructor(
        private readonly expCatService: ExpenseCategoryService,
    ) { }

    @Get("me")
    @UseGuards(JwtAuthGuard)
    getAllUserExpCategory(@GetUser() user: User) {
        return this.expCatService.findAllByUser(user.id)
    }

    @Get("global")
    @UseGuards(JwtAuthGuard)
    getAllGlobalExpCategory() {
        return this.expCatService.findAllGlobal()
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    getExpCatById(@Param("id") catId: number) {
        return this.expCatService.findOneById(catId);
    }

    @Post("add/user")
    @Roles(Role.User)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    addUserExpCategory(@Body() dto: CreateExpenseCatDto, @GetUser() user: User, @RealIP() ip: string) {
        return this.expCatService.addCategory(dto, false, user, ip)
    }

    @Post("add/global")
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    addGlobalExpCategory(@Body() dto: CreateExpenseCatDto, @GetUser() user: User, @RealIP() ip: string) {
        return this.expCatService.addCategory(dto, true, user, ip)
    }

    @Patch("update/:id")
    @UseGuards(JwtAuthGuard)
    updateCategory(@Param("id") catId: number, @Body() dto: UpdateExpCatDto, @GetUser() user: User, @RealIP() ip: string) {
        return this.expCatService.updateCategory(catId, user, dto, ip)
    }

    @Delete("hard-delete/:id")
    @UseGuards(JwtAuthGuard)
    hardDeleteById(@Param("id") id: number, @GetUser() user: User, @RealIP() ip: string) {
        return this.expCatService.hardDeleteById(id, user, ip)
    }

    @Delete("soft-delete/:id")
    @UseGuards(JwtAuthGuard)
    softDeleteById(@Param("id") id: number, @GetUser() user: User, @RealIP() ip: string) {
        return this.expCatService.softDeleteById(id, user, ip)
    }


}

