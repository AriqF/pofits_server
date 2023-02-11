export interface IJWTPayload {
    email: string;
    isRefresh?: boolean;
    iat?: number;
    exp?: number;
}