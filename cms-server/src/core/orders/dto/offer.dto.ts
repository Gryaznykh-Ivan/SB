import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";


export class ConnectOfferDto {
    @IsInt()
    id: number;
}

export class DisconnectOfferDto {
    @IsInt()
    id: number;
}