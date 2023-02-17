import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailDto } from './dto/email.dto';
import * as handlerbars from 'handlebars';
import { WeblogService } from 'src/weblog/weblog.service';
import { LogType } from 'src/weblog/interfaces/log-type.enum';

const thisModule = "Mailer"

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly logService: WeblogService,
    ) { }

    async send(emailDto: EmailDto): Promise<void> {
        const email = emailDto.to.join(", ");
        try {
            let htmlToSend = "";

            if (emailDto.template != null) {
                let template = './template/reset-password.html';
                let hb = handlerbars.compile(template);
                htmlToSend = hb(emailDto.body);
            } else {
                htmlToSend = emailDto.html;
            }

            let response = await this.mailerService
                .sendMail({
                    to: email, // list of receivers
                    subject: emailDto.subject, // Subject line
                    html: htmlToSend, // HTML body content
                })
            // console.log("email", response)
            return response
        } catch (error) {
            const log = `Failed to send email to ${email}: ${String(email)}`;
            await this.logService.addLog(log, thisModule, LogType.Failure)
            throw new InternalServerErrorException(`Failed to send email: ${String(error)}`)
        }
    }
}
