import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WeblogModule } from 'src/weblog/weblog.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get("SMTP_HOST"),
          ignoreTLS: true,
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
          },
        },
        defaults: {
          from: `"PofitsApp No-Reply" <pofitsapp@gmail.com>`,
        },
      })
    }),
    WeblogModule,
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule { }
