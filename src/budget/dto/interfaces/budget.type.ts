import { Budget } from "src/budget/entities/budget.entity"


export interface ProcessedBudget extends Budget {
    remaining: number;
    diff: number;
}