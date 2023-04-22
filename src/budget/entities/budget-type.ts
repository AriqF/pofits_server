import { Budget } from "./budget.entity";


export class ProcessedBudget extends Budget {
    amountUsed: number; //current used amount in budget
    percentageUsed: number;
    amountRemaining: number;
}