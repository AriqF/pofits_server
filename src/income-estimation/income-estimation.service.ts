import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { BudgetFilterDto } from 'src/budget/dto/filter-budget.dto';
import { IncomeCategory } from 'src/income-category/entity/income-category.entity';
import { User } from 'src/user/entities/user.entity';
import { DataErrorID } from 'src/utils/global/enum/error-message.enum';
import { DataSuccessID } from 'src/utils/global/enum/success-message.enum';
import { convertStartEndDateFmt, getListMonthDifferenece, getStartEndDateFmt, validateMoreThanDate } from 'src/utils/helper';
import { LogType } from 'src/weblog/interfaces/log-type.enum';
import { WeblogService } from 'src/weblog/weblog.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateEstimationDto } from './dto/create-income-estimation.dto';
import { UpdateIncomeEstimationDto } from './dto/update-income-estimation.dto';
import { IncomeEstimation } from './entities/income-estimation.entity';

const thisModule = "Income Estimation"

@Injectable()
export class IncomeEstimationService {

  constructor(
    @InjectRepository(IncomeEstimation)
    private estimationRepo: Repository<IncomeEstimation>,
    private readonly logService: WeblogService,
  ) { }

  getQueryEstimation(): SelectQueryBuilder<IncomeEstimation> {
    const query = this.estimationRepo.createQueryBuilder("est")
      .leftJoin("est.created_by", "cr")
      .leftJoin("est.category", "cat")
      .select([
        "est.id", "est.amount", "est.isRepeat", "est.start_date", "est.end_date",
        "est.created_at", "est.updated_at", "est.deleted_at",
        "cr.id", "cr.email", "cr.username", "cat.id", "cat.title",
      ])
    return query
  }

  async findAllUserEstimation(user: User): Promise<IncomeEstimation[]> {
    const data = await this.getQueryEstimation()
      .where("cr.id = :uid", { uid: user.id })
      .getMany();
    if (data.length == 0) throw new NotFoundException(DataErrorID.NotFound);
    return data;
  }

  async findAllEstimationByFilter(user: User, filter: BudgetFilterDto): Promise<IncomeEstimation[]> {
    let { month } = filter;
    let searchDate = new Date(moment(month).startOf("month").format("YYYY-MM-DD"))
    const data = await this.getQueryEstimation()
      .where("cr.id = :uid", { uid: user.id })
      .andWhere("est.start_date = :val", { val: searchDate })
      .getMany();
    if (data.length == 0) throw new NotFoundException(DataErrorID.FilterNotFound)
    return data
  }

  async findOneById(id: number, user: User): Promise<IncomeEstimation> {
    const data = await this.getQueryEstimation()
      .where("est.id = :eid", { eid: id })
      .andWhere("cr.id = :uid", { uid: user.id })
      .getOne();
    if (!data) throw new NotFoundException(DataErrorID.NotFound)
    if (data.created_by.id != user.id) throw new ForbiddenException(DataErrorID.Forbidden)
    return data
  }

  async getOneById(id: number): Promise<IncomeEstimation> {
    return await this.estimationRepo.findOne({ where: { id: id } })
  }

  async getMonthEstimationByCategory(cid: number | IncomeCategory, date: Date): Promise<IncomeEstimation> {
    const data = await this.getQueryEstimation()
      .where("cat.id = :id", { id: cid })
      .andWhere("est.start_date = :sd", { sd: date })
      .getOne();
    return data;
  }

  async createIncomeEstimation(dto: CreateEstimationDto, user: User, ip: string): Promise<Object> {
    let { start_date, end_date, isRepeat, category } = dto

    if (isRepeat && !end_date) {
      throw new BadRequestException("Bulan berakhir tidak boleh kosong jika pengeluaran berulang!")
    }

    if (isRepeat && end_date) {
      if (!validateMoreThanDate(start_date, end_date)) {
        throw new BadRequestException("Bulan berakhir tidak boleh kurang dari bulan awal")
      }
    }

    let [startDateFmt, endDateFmt] = convertStartEndDateFmt(start_date, end_date, isRepeat)

    //validate if budget category this month is exist
    if (!(await this.validateCurrentMonthBudget(user.id, category, startDateFmt, endDateFmt))) {
      throw new ConflictException("Kategori ini sudah memiliki budget pada periode ini")
    }

    try {
      const sDateList = getListMonthDifferenece(startDateFmt, endDateFmt);
      sDateList.forEach(async (valDate) => {
        let endDate = new Date(moment(valDate).endOf("month").format("YYYY-MM-DD"));
        let newData = this.estimationRepo.create({
          start_date: valDate,
          end_date: endDate,
          category, isRepeat,
          amount: dto.amount,
          created_by: user
        });
        await this.estimationRepo.save(newData);
      });

      await this.logService.addLog("Added a income estimation", thisModule, LogType.Info, ip, user.id)
      return { message: DataSuccessID.DataAdded }
    } catch (error) {
      await this.logService.addLog("Failed to add income estimation", thisModule, LogType.Failure, ip, user.id)
      throw new InternalServerErrorException(error)
    }
  }

  async validateCurrentMonthBudget(userId: number, category: IncomeCategory, startDate: Date, endDate: Date): Promise<boolean> {
    const findData: IncomeEstimation = await this.getQueryEstimation()
      .where("cr.id = :uid", { uid: userId })
      .andWhere("cat.id = :cid", { cid: category })
      .andWhere("est.start_date >= :vs", { vs: moment(startDate).startOf("month").format('YYYY-MM-DD') })
      .andWhere("est.end_date <= :ve", { ve: moment(endDate).endOf("month").format('YYYY-MM-DD') })
      .getOne()
    if (findData) return false
    return true
  }

  async editIncomeEstimation(id: number, user: User, dto: UpdateIncomeEstimationDto, ip: string) {
    const find = await this.estimationRepo.findOne({ where: { id: id } })
    if (!find) throw new NotFoundException(DataErrorID.NotFound)
    if (find.created_by.id != user.id) throw new ForbiddenException(DataErrorID.Forbidden)

    try {
      await this.estimationRepo.update(id, {
        ...dto,
      });
      await this.logService.addLog("Updated a income estimation", thisModule, LogType.Info, ip, user.id)
      return { message: DataSuccessID.DataUpdated }
    } catch (error) {
      await this.logService.addLog("Failed to update income estimation", thisModule, LogType.Failure, ip, user.id)
      throw new InternalServerErrorException(error)
    }

  }

  async softDelete(id: number, user: User, ip: string) {
    const find = await this.estimationRepo.findOne({ where: { id: id } })
    if (!find) throw new NotFoundException(DataErrorID.NotFound)
    if (find.created_by.id != user.id) throw new ForbiddenException(DataErrorID.Forbidden)

    try {
      await this.estimationRepo.softDelete(id);
      await this.logService.addLog("Deleted an income estimation", thisModule, LogType.Info, ip, user.id)
      return { message: DataSuccessID.DataDeleted }
    } catch (error) {
      await this.logService.addLog("Failed to delete an income estimation", thisModule, LogType.Info, ip, user.id)
      throw new InternalServerErrorException(error)
    }
  }

  async hardDelete(id: number, user: User, ip: string) {
    const find = await this.estimationRepo.findOne({ where: { id: id }, withDeleted: true })
    if (!find) throw new NotFoundException(DataErrorID.NotFound)
    if (find.created_by.id != user.id) throw new ForbiddenException(DataErrorID.Forbidden)

    try {
      await this.estimationRepo.softDelete(id);
      await this.logService.addLog("Permanently deleted an income estimation", thisModule, LogType.Info, ip, user.id)
      return { message: DataSuccessID.DataDeleted }
    } catch (error) {
      await this.logService.addLog("Failed to delete an income estimation permanently", thisModule, LogType.Info, ip, user.id)
      throw new InternalServerErrorException(error)
    }
  }
  // !TEST THE API
}
