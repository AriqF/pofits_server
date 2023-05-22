import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { IJWTPayload } from "./jwt-payload.interface";
import { User } from "src/user/entities/user.entity";


@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly userService: UserService
    ) {
        super({
            secretOrKey: process.env.SECRET_KEY,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: IJWTPayload): Promise<User> {
        const { email } = payload;
        const user: User = await this.userService.getOneByEmail(email)
        if (!user) {
            throw new UnauthorizedException()
        }
        // if (payload.isRefresh) {
        //     throw new UnauthorizedException()
        // }

        if (user.status != 1) {
            throw new UnauthorizedException("User not active or has been deleted")
        }

        delete user.password

        return user;
    }
}