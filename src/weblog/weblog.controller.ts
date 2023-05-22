import { Controller, Get, UsePipes, ValidationPipe, Query, UseGuards } from '@nestjs/common';
import { WeblogService } from './weblog.service';
import { LogFilterDto } from './dto/filter.dto';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('weblog')
export class WeblogController {
    constructor(
        private readonly logService: WeblogService
    ) { }

    @Get()
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    getAllHistoryLogs(@Query() filterDto: LogFilterDto) {
        if (Object.keys(filterDto).length) {
            return this.logService.getLogsByFilter(filterDto)
        }
        return this.logService.getAllLogs()
    }

    @Get("count")
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    getCountLogs() {
        return this.logService.getTotalLogs()
    }
}
