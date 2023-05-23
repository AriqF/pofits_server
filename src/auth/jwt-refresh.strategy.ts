import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { IJWTPayload } from "./jwt-payload.interface";
import { User } from "src/user/entities/user.entity";


@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(Strategy, "jwt-refreshtoken") {

    constructor(
        private readonly userService: UserService,
    ) {
        super({
            secretOrKey: "pofits-secret",
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: IJWTPayload): Promise<User> {
        const { email, exp, isKeepSignedIn } = payload;
        const user: User = await this.userService.getOneByEmail(email)

        if (!user) {
            throw new UnauthorizedException()
        }

        // if (!isRefresh) {
        //     throw new UnauthorizedException()
        // }

        if (user.status != 1) {
            throw new UnauthorizedException("User not active or has been deleted")
        }

        if (new Date() > new Date(`${exp}000`)) {
            throw new UnauthorizedException();
        }

        delete user.password

        return user;
    }
}