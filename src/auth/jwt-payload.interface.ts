import { Role } from "src/user/interfaces/role.enum";

export interface IJWTPayload {
    email: string;
    role?: Role;
    isKeepSignedIn?: boolean;
    iat?: number;
    exp?: number;
}