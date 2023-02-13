import { Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { WeblogService } from 'src/weblog/weblog.service';
import { UserLoginDto } from './dto/user-login.dto';
import { IJWTPayload } from './jwt-payload.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { RequestResetDto } from './dto/req-reset.dto';
import { User } from 'src/user/entities/user.entity';
import { UpdateResult } from 'typeorm';
import { LogType } from 'src/weblog/interfaces/log-type.enum';
import { EmailDto } from 'src/email/dto/email.dto';
import { EmailService } from 'src/email/email.service';
import { SetNewPasswordDto } from './dto/new-password.dto';
import { Role } from 'src/user/interfaces/role.enum';

const thisModule = "Auth";
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly emailService: EmailService,
        private readonly logService: WeblogService,
    ) { }

    async signIn(loginDto: UserLoginDto, ip: string): Promise<Object> {
        const user = await this.userService.signIn(loginDto);
        const accessToken: string = this.getJwtAccessToken(user.email, user.role);
        const jwt: any = this.decodeJwtAccessToken(accessToken);
        const refreshToken: string = await this.generateRefreshToken(user.email, user.id);

        await this.userService.updateIat(user, jwt.iat);
        delete user.password;

        const log = "Logged in";
        await this.logService.addLog(log, thisModule, LogType.Info, ip, user.id);
        return {
            accessToken, refreshToken, role: user.role, message: "Login successful!"
        }
    }

    async signUp(regisDto: UserRegisterDto, ip: string, isAdmin: boolean): Promise<Object> {
        const user = await this.userService.signUp(regisDto, isAdmin);
        let log: string
        if (isAdmin) {
            log = "Registered to application as admin";
        } else {
            log = "Registered to application";
        }
        await this.logService.addLog(log, thisModule, LogType.Info, ip, user.id);
        return {
            message: "Register successfully!"
        }
    }

    async requestResetPassword(requestDto: RequestResetDto, ip: string): Promise<Object> {
        const user: User = await this.userService.getOneByEmail(requestDto.email);
        if (!user) throw new NotFoundException("Cannot find user with this email")

        const resetToken: string = this.generateResetToken(user.id, user.email);
        const updateRes: UpdateResult = await this.userService.updateResetToken(user.id, resetToken);
        if (updateRes.affected != 1) {
            const log = "Failed to update reset token user: " + user.email;
            await this.logService.addLog(log, thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException("Failed to update reset token")
        }

        let resetUrl: string = "http://pofitsapp.sample.vercel.app/resetPassword/";
        try {
            let emailDto: EmailDto = new EmailDto();
            emailDto.to = [user.email];
            emailDto.subject = "Request To Reset Your Password";
            emailDto.body = {};
            emailDto.html = `<h2>Hi!</h2>
                <p>This password reset link will expire in 20 minutes</p>
                <p>Link to reset your password: ${resetUrl}${resetToken} </p>`;
            await this.emailService.send(emailDto);

            const log = "Requested a reset password url";
            await this.logService.addLog(log, thisModule, LogType.Info, ip, user.id)
            return {
                message: "Email has been sent"
            }
        } catch (error) {
            const log = "Failed to request a reset password url";
            await this.logService.addLog(log, thisModule, LogType.Failure, ip, user.id)
        }
    }

    async setupNewPasswordMail(passwordDto: SetNewPasswordDto, resetToken: string, ip: string): Promise<Object> {
        const user: User = await this.userService.getOneByResetToken(resetToken);
        const decoded: any = this.jwtService.decode(resetToken);
        if (Date.now() >= decoded.exp * 1000) throw new UnauthorizedException("Token is no longer valid");

        try {
            await this.userService.updatePassword(user.id, passwordDto.password);
            await this.userService.deleteResetToken(user.id);
            await this.logService.addLog("Setup a new password", thisModule, LogType.Info, ip, user.id)
        } catch (error) {
            await this.logService.addLog(`Failed to change password: ${String(error)}`, thisModule, LogType.Failure, ip, user.id)
            throw new InternalServerErrorException("Password change failed.")
        }

        return { message: "Password change successfully" }
    }

    generateResetToken(userId: number, email: string): string {
        const user = this.userService.getOneByID(userId);
        const payload = { userId, email };
        return this.jwtService.sign(payload, {
            expiresIn: '20m'
        });
    }

    getJwtAccessToken(email: string, userRole: Role): string {
        const payload: IJWTPayload = { email, isRefresh: false, role: userRole };
        const token = this.jwtService.sign(payload, {
            expiresIn: '2h'
        });
        return token;
    }

    decodeJwtAccessToken(token: any): any {
        return this.jwtService.decode(token)
    }

    async generateRefreshToken(email: string, user_id: number): Promise<string> {
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 6);
        const payload: IJWTPayload = { email, isRefresh: true };
        const token = this.jwtService.sign(payload, { expiresIn: '6d' });
        return token;
    }

    async refreshToken(user: User): Promise<Object> {
        try {
            const accessToken = this.getJwtAccessToken(user.email, user.role);
            return { accessToken };
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
