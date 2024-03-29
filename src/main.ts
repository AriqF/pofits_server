import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import helmet from 'helmet';
import { AllExceptionFilter, EntityNotFoundFilter, HttpExceptionFilter } from './app.http_exception_filter.interceptor';
import { ValidationPipe } from '@nestjs/common/pipes';
import "moment/locale/id";
import * as moment from "moment";
import * as fs from "fs"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, disableErrorMessages: false }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalFilters(new EntityNotFoundFilter())
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter))
  moment.locale("id");

  app.enableCors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    // allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Access-Control-Allow-Origin',

  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
