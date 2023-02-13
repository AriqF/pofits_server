import { Module, Global, forwardRef } from '@nestjs/common';
import { WeblogService } from './weblog.service';
import { WeblogController } from './weblog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weblog } from './entities/weblog.entity';
import { UserModule } from 'src/user/user.module';

// @Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Weblog,
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [WeblogService],
  controllers: [WeblogController],
  exports: [WeblogService],
})
export class WeblogModule { }
