import { Budget } from "src/budget/entity/budget.entity"


export interface ProcessedBudget extends Budget {
    remaining: number;
    diff: number;
}