import { Right, Role } from "@prisma/client";

export interface IUser {
    id: number;
    role: Role;
    name: string;
    permissions: Right[]
    iat: number;
    exp: number;
}