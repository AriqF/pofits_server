import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DataErrorID } from 'src/utils/global/enum/error-message.enum';
import { DataSuccessID } from 'src/utils/global/enum/success-message.enum';
import { LogType } from 'src/weblog/interfaces/log-type.enum';
import { WeblogService } from 'src/weblog/weblog.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { MoveWalletDto } from './dto/move-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entity/wallet.entity';

const thisModule = "Wallet"

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepo: Repository<Wallet>,
        private readonly logService: WeblogService
    ) { }

    getWalletQuery(): SelectQueryBuilder<Wallet> {
        const query = this.walletRepo.createQueryBuilder('wl')
            .leftJoin('wl.created_by', 'cr')
            .select([
                'wl.id', 'wl.name', 'wl.description', 'wl.amount', 'wl.created_at',
                'wl.updated_at', 'wl.deleted_at', 'cr.id', 'cr.email', 'cr.username',
            ])
        return query;
    }

    async findAllByUser(userId: number): Promise<Wallet[]> {
        const wallets = await this.getWalletQuery()
            .where('cr.id = :uid', { uid: userId })
            .getMany();
        if (wallets.length == 0) throw new NotFoundException(DataErrorID.NotFound)
        return wallets
    }

    async findOneById(walletId: number): Promise<Wallet> {
        const wallet = await this.getWalletQuery()
            .where("wl.id = :wid", { wid: walletId })
            .getOne();
        if (!wallet) throw new NotFoundException(DataErrorID.NotFound)
        return wallet
    }

    async addWallet(addDto: CreateWalletDto, user: User, ip: string): Promise<Object> {
        try {
            let wallet = this.walletRepo.create({
                ...addDto,
                created_by: user
            })
            await this.walletRepo.save(wallet);
            await this.logService.addLog("Added a new wallet", thisModule, LogType.Info, ip, user.id)
            return { message: DataSuccessID.DataAdded }
        } catch (error) {
            await this.logService.addLog("Failed to add wallet: " + String(error), thisModule, LogType.Info, ip, user.id)
            throw new InternalServerErrorException(DataErrorID.AddFailed + error)
        }
    }

    async updateWallet(walletId: number, updDto: UpdateWalletDto, user: User, ip: string): Promise<Object> {
        const wallet = await this.walletRepo.findOne({ where: { id: walletId } })
        if (!wallet) throw new NotFoundException(DataErrorID.NotFound)

        try {
            await this.walletRepo.update(walletId, { ...updDto })
            await this.logService.addLog("Updated a wallet", thisModule, LogType.Info, ip, user.id);
            return { message: DataSuccessID.DataUpdated }
        } catch (error) {
            await this.logService.addLog("Failed to update wallet: " + String(error), thisModule, LogType.Failure, ip, user.id);
            throw new InternalServerErrorException(DataErrorID.UpdateFailed + error)
        }
    }

    async softDeleteById(walletId: number, user: User, ip: string): Promise<Object> {
        const wallet = await this.walletRepo.findOne({ where: { id: walletId } })
        if (!wallet) throw new NotFoundException(DataErrorID.NotFound)

        try {
            await this.walletRepo.softDelete(walletId)
            await this.logService.addLog("Soft deleted a wallet", thisModule, LogType.Info, ip);
            return { message: DataSuccessID.DataDeleted }
        } catch (error) {
            await this.logService.addLog("Soft deleted a wallet: " + String(error), thisModule, LogType.Info, ip);
            throw new InternalServerErrorException(DataErrorID.DeleteFailed + error)
        }
    }

    async hardDeleteById(walletId: number, user: User, ip: string): Promise<Object> {
        const wallet = await this.walletRepo.findOne({ where: { id: walletId } })
        if (!wallet) throw new NotFoundException(DataErrorID.NotFound)

        try {
            await this.walletRepo.delete(walletId);
            await this.logService.addLog("Permanently deleted a wallet", thisModule, LogType.Info, ip);
            return { message: DataSuccessID.DataHardDeleted }
        } catch (error) {
            await this.logService.addLog("Failed to permanently delete a wallet: " + String(error), thisModule, LogType.Failure, ip);
            throw new InternalServerErrorException(DataErrorID.DeleteFailed + error)
        }
    }

    async moveMoneyWallet(moveDto: MoveWalletDto, user: User, ip: string) {
        const { from_wallet, to_wallet } = moveDto
        const fromWallet = await this.walletRepo.findOne({ where: { id: Number(from_wallet) } })
        const toWallet = await this.walletRepo.findOne({ where: { id: Number(to_wallet) } })
        if (!fromWallet || !toWallet) throw new NotFoundException(DataErrorID.NotFound)
        const moveAmount: number = moveDto.amount

        try {
            if (fromWallet.amount < moveAmount) throw new BadRequestException("Dana yang dipindahkan tidak dapat melebihi total dana")
            await this.walletRepo.update(fromWallet.id, {
                amount: fromWallet.amount - moveAmount
            })
            await this.walletRepo.update(toWallet.id, {
                amount: Number(moveAmount) + Number(toWallet.amount)
            })
            await this.logService.addLog("Moved wallet's amount", thisModule, LogType.Info, ip, user.id);
            return { message: "Dana berhasil dipindahkan" }
        } catch (error) {
            await this.logService.addLog("Failed to moved wallet's amount: " + String(error), thisModule, LogType.Info, ip, user.id);
            throw new InternalServerErrorException("Gagal dalam memindahkan dana. " + error)
        }
    }
}
