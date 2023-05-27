import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    // delete req.user.refresh_token;
    if (!req.user) throw new Error("Cannot get user (User Decorator)")
    return req.user;
})