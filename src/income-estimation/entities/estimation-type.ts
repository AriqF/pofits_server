import { IncomeEstimation } from "./income-estimation.entity";

export class ProcessedEstimation extends IncomeEstimation {
    amountAchieved: number;
    percentageAchieved: number;
    amountUnachieved: number;
    isAchieved: boolean;
}