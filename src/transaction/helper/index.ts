import { Budget } from "src/budget/entities/budget.entity";
import { IncomeEstimation } from "src/income-estimation/entities/income-estimation.entity";
import { IncomeTransaction } from "src/income-transaction/entities/income-transaction.entity";
import { ExpenseTransaction } from "../entities/expense-transaction.entity";

export function getAccumulatedTransactions(transactions: ExpenseTransaction[] | IncomeTransaction[]): number {
    let total: number = 0;
    transactions.map((trans: ExpenseTransaction | IncomeTransaction) => {
        total += Number(trans.amount)
    })
    return total;
}

export function getExpenseDiffPercentage(budget: Budget, transAmount: number) {
    return (transAmount / budget.amount) * 100
}

export function getIncomeDiffPercentage(estimation: IncomeEstimation, transAmount: number) {
    return (transAmount / estimation.amount) * 100;
}


