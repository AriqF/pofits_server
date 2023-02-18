import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { WeblogModule } from './weblog/weblog.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: 3306,
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          __dirname + '/../**/entities/*.entity.{js,ts}'
        ],
        migrations: [
          __dirname + '/migrations/*{.ts,.js}'
        ],
        cli: {
          migrationsDir: 'src/migrations'
        },
        migrationsTableName: "migrations_typeorm",
        migrationsRun: true,
        synchronize: true,
        dropSchema: false,
        logging: false,
        autoLoadEntities: true,
        timezone: 'Z',
      }),
    }),
    AuthModule,
    UserModule,
    WeblogModule,
    EmailModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
