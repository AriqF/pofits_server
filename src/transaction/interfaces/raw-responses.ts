
export interface AnnualTransactionQuery {
    month: number;
    total_amount: number;
}

export interface AnnualTransaction {
    month: string;
    total_amount: number;
}