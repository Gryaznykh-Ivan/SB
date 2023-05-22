import { FulfillmentStatus, ReturnStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { ConnectOfferDto } from "./offer.dto";


export class ConnectReturnOfferDto {
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsString()
    reason: string;
}

export class CreateReturnDto {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ConnectReturnOfferDto)
    offers: ConnectReturnOfferDto[]
}

export class UpdateReturnDto {
    @IsOptional()
    @IsEnum(ReturnStatus, { each: true })
    status: ReturnStatus;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    tracking: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    carrier: string;
}