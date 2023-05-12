import { FinanceGoal } from "../entities/finance-goal.entity";


export class GoalResponse extends FinanceGoal {
    times_to_save_left?: number;
    estimated_achieved?: Date;
    amounts_to_save_left?: number;
    percentage?: number;
    days_to_go?: number;
}