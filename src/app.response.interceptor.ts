import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment-timezone';

export interface Response<T> {
    code: number;
    message: string;
    data: T;
}

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, Response<any>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<any>> {
        return next
            .handle()
            .pipe(
                map((data) => ({
                    code: context.switchToHttp().getResponse().statusCode,
                    message: data.message || "success",
                    data: data,
                    timestamp: moment.tz("Asia/Jakarta").format()
                })),
            );
    }
}