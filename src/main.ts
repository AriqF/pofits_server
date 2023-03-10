import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { EntityNotFoundFilter, HttpExceptionFilter } from './app.http_exception_filter.interceptor';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, disableErrorMessages: false }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalFilters(new EntityNotFoundFilter())
  app.enableCors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
  });
  await app.listen(3000);
}
bootstrap();
