import { IsEmail, IsOptional, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    readonly login: string;

    @IsString()
    readonly code: string;

    @IsOptional()
    readonly guestId: number;
}