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

export function getListMonthDifferenece(date1: Date, date2: Date): Date[] {
    let months: Date[] = [date1];
    const monthDiff: number = getMonthDifference(date1, date2) + 1;
    for (let index = 1; index < monthDiff; index++) {
        let nextMonth = getNextMonthDate(months[index - 1])
        months.push(getDateStartMonth(nextMonth))
    }
    return months
}

export function getNextMonthDate(currDate: Date): Date {
    return new Date(currDate.getFullYear(), currDate.getMonth() + 1, 2)
}

export function getMonthDifference(date1: Date, date2: Date): number {
    return Math.abs(date1.getMonth() - date2.getMonth())
}

export function getDateStartMonth(date: Date): Date {
    return new Date(moment(date).startOf("month").format('YYYY-MM-DD'))
}

export function getDateEndMonth(date: Date): Date {
    return new Date(moment(date).endOf("month").format('YYYY-MM-DD'))
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

export function isIpv6(ip: string): boolean {
    const v6RegexExp = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi;
    return v6RegexExp.test(ip);
}

export function convertV6toV4(ip: string): string {
    let split_str = ip.split(":");
    ip = split_str[6] + split_str[7];
    let ip_1 = ~parseInt(ip.toString().substring(0, 2), 16) & 0xFF;
    let ip_2 = ~parseInt(ip.toString().substring(2, 4), 16) & 0xFF;
    let ip_3 = ~parseInt(ip.toString().substring(4, 6), 16) & 0xFF;
    let ip_4 = ~parseInt(ip.toString().substring(6, 8), 16) & 0xFF;

    return `${ip_1}.${ip_2}.${ip_3}.${ip_4}`;
}