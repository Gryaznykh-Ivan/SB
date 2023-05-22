import { IsEmail, IsInt, IsOptional, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    readonly login: string;

    @IsString()
    readonly code: string;

    @IsOptional()
    @IsInt()
    readonly guestId: number;
}