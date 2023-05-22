import { Right, Role } from "@prisma/client";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEmail, IsEnum, IsInt, isNotEmpty, IsNotEmpty, IsOptional, IsString, Length, MinLength, NotEquals, ValidateIf, ValidateNested } from "class-validator";
import { CreateAddressDto, UpdateAddressDto } from "./address.dto";

export class UpdateUserDto {
    @IsString()
    @MinLength(2)
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    @Transform(({ value }: TransformFnParams) => value?.trim() ?? null)
    firstName: string;

    @IsString()
    @MinLength(2)
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    @Transform(({ value }: TransformFnParams) => value?.trim() ?? null)
    lastName: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    inn: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    account: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    correspondentAccount: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    bic: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    passport: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;

    @IsOptional()
    @IsBoolean()
    isVerified: boolean;

    @IsOptional()
    @IsBoolean()
    isSubscribed: boolean;

    @IsOptional()
    @IsEnum(Right, { each: true })
    createPermissions: Right[];

    @IsOptional()
    @IsInt({ each: true })
    deletePermissions: number[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAddressDto)
    createAddresses: CreateAddressDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateAddressDto)
    updateAddresses: UpdateAddressDto[]

    @IsOptional()
    @IsInt({ each: true })
    deleteAddresses: number[];
}