import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";


export class ConnectCollectionDto {
    @IsInt()
    id: number;
}

export class DisconnectCollectionDto {
    @IsInt()
    id: number;
}