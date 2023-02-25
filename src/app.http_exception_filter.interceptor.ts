import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import * as moment from 'moment-timezone';
import { RealIP } from "nestjs-real-ip";
import { EntityNotFoundError, TypeORMError } from "typeorm";

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        let status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        let resErr: any = exception instanceof HttpException ? (typeof exception.getResponse() === "string" ? {} : exception.getResponse()) : {
            code: status,
            message: "Internal server error"
        };
        console.log({
            timestamp: moment.tz("Asia/Jakarta").format(),
            ...resErr,
            // headers: request.headers
        })
        if (resErr.statusCode) {
            resErr.code = resErr.statusCode;
            delete resErr.statusCode;
        }

        if (status == 422) {
            status = 422
            resErr.code = 422;
        }
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
                code: 400,
                message: "Terjadi kesalahan",
                timestamp: new Date().toISOString()
            });
        } else if (response.status(404)) {
            response.json({
                code: 404,
                message: "Data tidak ditemukan",
                timestamp: new Date().toISOString()
            });
        } else {
            response
                .status(400)
                .json({
                    code: 400,
                    message: "Bad Request",
                    timestamp: new Date().toISOString()
                });
        }

    }
}