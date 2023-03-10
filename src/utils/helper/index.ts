import { BadRequestException } from "@nestjs/common/exceptions";
import { validate } from "class-validator";
import * as moment from "moment"


export function getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
}

export function formatMonthNumber(month: number): string {
    if (month < 9) {
        return `0${month}`
    }
    return `${month}`
}

export function convertStartEndDateFmt(start: Date, end: Date, isRepeat: boolean): [Date, Date] {
    let startDate: Date;
    let endDate: Date;

    startDate = new Date(moment(start).startOf("month").format('YYYY-MM-DD'))

    if (!isRepeat) {
        endDate = new Date(moment(start).endOf("month").format('YYYY-MM-DD'))
    } else {
        endDate = new Date(moment(end).endOf("month").format('YYYY-MM-DD'))
    }

    return [startDate, endDate]
}

export function validateMoreThanDate(start: Date, end: Date): boolean {
    return start < end
}

export function getStartEndDateFmt(start_date: Date, end_date: Date, isRepeat: boolean): [Date, Date] {
    let startMonth = Number(start_date.getMonth() + 1)
    let startYear: number = start_date.getFullYear()

    let startDateFmt: Date;
    let endDateFmt: Date;

    //validate start date
    startDateFmt = new Date(startYear + "-" + formatMonthNumber(startMonth) + "-" + "01")

    if (!isRepeat) {
        endDateFmt = new Date(startYear + "-" + formatMonthNumber(startMonth) + "-" + getDaysInMonth(startMonth, startYear))
    } else {
        //get the end date format
        let endMonth = Number(end_date.getMonth() + 1);
        let endYear: number = end_date.getFullYear()
        endDateFmt = new Date(endYear + "-" + formatMonthNumber(startMonth) + "-" + getDaysInMonth(endMonth, endYear))
    }

    return [startDateFmt, endDateFmt]
}