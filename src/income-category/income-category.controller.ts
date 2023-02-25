import { Body, Controller, Param, ValidationPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { UsePipes } from '@nestjs/common/decorators/core/use-pipes.decorator';
import { Delete, Get, Patch, Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { RealIP } from 'nestjs-real-ip';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/role.guard';
import { User } from 'src/user/entities/user.entity';
import { CreateIncCatDto } from './dto/create-income-category.dto';
import { UpdateIncCatDto } from './dto/update-income-category.dto';
import { IncomeCategoryService } from './income-category.service';

@Controller('income-category')
export class IncomeCategoryController {
    constructor(
        private readonly categoryService: IncomeCategoryService
    ) { }

    @Get("me")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    getAllUserIncCategory(@GetUser() user: User) {
        return this.categoryService.findAllByUser(user.id)
    }

    @Get("global")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    getAllGlobalIncCategory() {
        return this.categoryService.findAllGlobal()
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    getIncCategoryById(@Param("id") id: number) {
        return this.categoryService.findOneById(id)
    }

    @Post("add/global")
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    addGlobalIncCategory(@Body() dto: CreateIncCatDto, @GetUser() user: User, @RealIP() ip: string) {
        return this.categoryService.addCategory(dto, true, user, ip);
    }

    @Post("add/user")
    @Roles(Role.User)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    addUserIncCategory(@Body() dto: CreateIncCatDto, @GetUser() user: User, @RealIP() ip: string) {
        return this.categoryService.addCategory(dto, false, user, ip);
    }

    @Patch("update/:id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    updateCategory(@Param("id") id: number, @Body() dto: UpdateIncCatDto, @GetUser() user: User, @RealIP() ip: string) {
        return this.categoryService.updateCategory(id, dto, user, ip)
    }

    @Delete("hard-delete/:id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    hardDeleteCategory(@Param("id") id: number, @GetUser() user: User, @RealIP() ip: string) {
        return this.categoryService.hardDelete(id, user, ip)
    }

    @Delete("soft-delete/:id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    softDeleteCategory(@Param("id") id: number, @GetUser() user: User, @RealIP() ip: string) {
        return this.categoryService.softDelete(id, user, ip)
    }
}
