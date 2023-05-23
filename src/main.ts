import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import helmet from 'helmet';
import { EntityNotFoundFilter, HttpExceptionFilter } from './app.http_exception_filter.interceptor';
import { ValidationPipe } from '@nestjs/common/pipes';
import "moment/locale/id";
import * as moment from "moment";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, disableErrorMessages: false }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalFilters(new EntityNotFoundFilter())
  moment.locale("id");
  app.enableCors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    // allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Access-Control-Allow-Origin',

  });
  await app.listen(3000);
}
bootstrap();
