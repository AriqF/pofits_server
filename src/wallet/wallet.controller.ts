import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { MoveWalletDto } from './dto/move-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
    constructor(
        private readonly walletService: WalletService,
    ) { }

    @Get("me")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    getAllMyWallets(@GetUser() user: User) {
        return this.walletService.findAllByUser(user.id)
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    getWalletById(@Param("id") walletId: number, @GetUser() user: User) {
        return this.walletService.findOneById(walletId, user)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    addWallet(@GetUser() user: User, @Body() addDto: CreateWalletDto, @RealIP() ip: string) {
        return this.walletService.addWallet(addDto, user, ip)
    }

    @Patch("move-amount")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    moveAmount(@GetUser() user: User, @Body() moveDto: MoveWalletDto, @RealIP() ip: string) {
        return this.walletService.moveMoneyWallet(moveDto, user, ip)
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    updateWallet(@Param("id") walletId: number, @GetUser() user: User, @Body() updDto: UpdateWalletDto, @RealIP() ip: string) {
        return this.walletService.updateWallet(walletId, updDto, user, ip)
    }

    @Delete("soft-delete/:id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    softDeleteWallet(@Param("id") walletId: number, @GetUser() user: User, @RealIP() ip: string) {
        return this.walletService.softDeleteById(walletId, user, ip)
    }

    @Delete("hard-delete/:id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    hardDeleteWallet(@Param("id") walletId: number, @GetUser() user: User, @RealIP() ip: string) {
        return this.walletService.hardDeleteById(walletId, user, ip)
    }
}
