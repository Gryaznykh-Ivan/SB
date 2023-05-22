import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";


export class CreateMetafieldDto {
    @IsNotEmpty()
    @IsString()
    key: string;

    @IsNotEmpty()
    @IsString()
    value: string;
}

export class UpdateMetafieldDto {
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsString()
    key: string;

    @IsNotEmpty()
    @IsString()
    value: string;
}

export class DeleteMetafieldDto {
    @IsInt()
    id: number;
}