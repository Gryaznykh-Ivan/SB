
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { ConnectOfferDto } from "./offer.dto";

export class CreateOrderDto {
    @IsInt()
    userId: number;

    @IsNotEmpty()
    @IsString()
    mailingCountry: string;

    @IsNotEmpty()
    @IsString()
    mailingCity: string;

    @IsNotEmpty()
    @IsString()
    mailingRegion: string;

    @IsNotEmpty()
    @IsString()
    mailingAddress: string;

    @IsOptional()
    @IsString()
    note: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ConnectOfferDto)
    offers: ConnectOfferDto[]
}