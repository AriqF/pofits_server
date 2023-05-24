import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as moment from 'moment-timezone';
import { convertV6toV4, isIpv6 } from "src/utils/helper";


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log({
            timestamp: moment.tz("Asia/Jakarta").format(),
            method: req.method,
            path: req.path,
            ip: isIpv6(req.ip) ? convertV6toV4(req.ip) : req.ip,
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