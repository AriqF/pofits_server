import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import * as moment from 'moment-timezone';
import { RealIP } from "nestjs-real-ip";
import { EntityNotFoundError, TypeORMError } from "typeorm";
import jwt_decode from "jwt-decode";
import { IJWTPayload } from "./auth/jwt-payload.interface";
import { HttpAdapterHost } from "@nestjs/core";

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        let decoded: IJWTPayload;

        let status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        let resErr: any = exception instanceof HttpException ? (typeof exception.getResponse() === "string" ? {} : exception.getResponse()) : {
            code: status,
            message: "Internal server error"
        };

        //!SUSPECT UNHANDLED ERROR
        // if (request.headers["authorization"]) {
        //     const token = request.headers["authorization"] as string;
        //     decoded = jwt_decode(token);
        //     delete decoded.iat;
        //     delete decoded.exp;
        //     delete decoded.isKeepSignedIn;
        // }

        if (resErr.statusCode) {
            resErr.code = resErr.statusCode;
            delete resErr.statusCode;
        }

        if (status == 422) {
            status = 422
            resErr.code = 422;
        }
        console.log({
            exception: "HttpException",
            timestamp: moment.tz("Asia/Jakarta").format(),
            cause: exception.message,
            stack: exception.stack ? exception.stack : "",
            ...resErr,
            // ...decoded,
            ...exception,
        })

        response
            .status(status)
            .json({
                ...resErr,
                timestamp: moment.tz("Asia/Jakarta").format()
            });
    }
}
@Catch(EntityNotFoundError, TypeORMError)
export class EntityNotFoundFilter implements ExceptionFilter {
    catch(exception: EntityNotFoundError, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        // const errMessage = exception.message;
        if (response.status(500)) {
            response.json({
                exception: "EntityNotFound",
                code: 400,
                message: "Terjadi kesalahan",
                timestamp: moment.tz("Asia/Jakarta").format()
            });
        } else if (response.status(404)) {
            response.json({
                exception: "EntityNotFound",
                code: 404,
                message: "Data tidak ditemukan",
                timestamp: moment.tz("Asia/Jakarta").format()
            });
        } else {
            response
                .status(400)
                .json({
                    exception: "EntityNotFound",
                    code: 400,
                    message: "Bad Request",
                    timestamp: moment.tz("Asia/Jakarta").format()
                });
        }

    }
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }
    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            exception: "AllException",
            statusCode: httpStatus,
            timestamp: moment.tz("Asia/Jakarta").format(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            unknownException: exception,
        };
        console.log(responseBody)
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}