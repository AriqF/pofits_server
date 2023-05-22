import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as moment from 'moment-timezone';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log({
            timestamp: moment.tz("Asia/Jakarta").format(),
            method: req.method,
            path: req.path,
            ip: req.ip,
            payload: {
                body: {
                    ...req.body
                },
                query: {
                    ...req.query
                },
                params: {
                    ...req.params
                }
            }
        })
        next();
    }

}