import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";
import { Wallet } from "../entities/wallet.entity";


export class MoveWalletDto {

    @IsNotEmpty()
    @Type(() => Number)
    from_wallet: Wallet;

    @IsNotEmpty()
    @Type(() => Number)
    to_wallet: Wallet;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    amount: number;
}