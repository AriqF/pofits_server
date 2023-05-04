import { Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Weblog } from './entities/weblog.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { LogFilterDto } from './dto/filter.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { LogType } from './interfaces/log-type.enum';

@Injectable()
export class WeblogService {
    constructor(
        @InjectRepository(Weblog)
        private wlogRepo: Repository<Weblog>,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
    ) { }

    getQueryLog(): SelectQueryBuilder<Weblog> {
        const query = this.wlogRepo.createQueryBuilder('weblog')
            .leftJoin('weblog.created_by', 'user_cr')
            .select([
                'weblog.id', 'weblog.module', 'weblog.type', 'weblog.log', 'weblog.created_at',
                'user_cr.email', 'user_cr.firstname', 'user_cr.lastname',
            ])
            .orderBy('weblog.created_at', 'DESC')
        return query
    }

    async getAllLogs(): Promise<Weblog[]> {
        const logs = await this.getQueryLog().getMany();
        if (logs.length == 0) throw new NotFoundException("No system log at the moment")
        return logs
    }

    async getLogsByFilter(filter: LogFilterDto): Promise<Weblog[]> {
        let { month, year, page } = filter
        if (!page) page = 1;

        const query = this.getQueryLog();

        if (month) query.andWhere('month(log.created_at) = :m', { m: month })

        if (year) query.andWhere('year(log.created_at) = :y', { y: year })

        let logs = await query
            .take(15)
            .skip(15 * (page - 1))
            .getMany();

        if (logs.length == 0) throw new NotFoundException("No Filter Match This Criteria")

        return logs
    }

    async addLog(log: string, module: string, type?: LogType, ip?: string, userId?: number) {
        const user: User = await this.userService.findOne(userId)
        if (this.isIpv6(ip)) ip = this.convertV6toV4(ip)
        try {
            let newLog = this.wlogRepo.create({
                log: log,
                ip_address: ip,
                module: module,
                type: type ? type : LogType.Info,
                created_by: user
            })
            newLog = await this.wlogRepo.save(newLog);
        } catch (error) {
            throw new InternalServerErrorException("Failed to add log: " + error)
        }
    }

    isIpv6(ip: string): boolean {
        const v6RegexExp = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi;
        return v6RegexExp.test(ip);
    }

    convertV6toV4(ip: string): string {
        let split_str = ip.split(":");
        ip = split_str[6] + split_str[7];
        let ip_1 = ~parseInt(ip.toString().substring(0, 2), 16) & 0xFF;
        let ip_2 = ~parseInt(ip.toString().substring(2, 4), 16) & 0xFF;
        let ip_3 = ~parseInt(ip.toString().substring(4, 6), 16) & 0xFF;
        let ip_4 = ~parseInt(ip.toString().substring(6, 8), 16) & 0xFF;

        return `${ip_1}.${ip_2}.${ip_3}.${ip_4}`;
    }
}
