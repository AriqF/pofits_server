
export enum TransactionType {
    Income = "income",
    Expense = "expense"
}

export interface GetTransactionsResponse {
    id: number;
    category: {
        id: number;
        title: string;
        icon: string;
    };
    wallet?: {
        id: number;
        name: string;
        amount: number;
    };
    title: string;
    description?: string;
    amount: number;
    type: TransactionType;
    date: Date;
    created_at: Date;
    created_by: {
        id: number;
        email: string;
    }
}