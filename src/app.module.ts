import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: 3306,
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'root'),
        database: configService.get('DB_NAME', 'pofits'),
        entities: [
          __dirname + '/entities/*.entity{.ts,.js}',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
