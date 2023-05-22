import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";


export class ConnectProductDto {
    @IsNotEmpty()
    @IsInt()
    id: number;
}

export class DisconnectProductDto {
    @IsNotEmpty()
    @IsInt()
    id: number;
}