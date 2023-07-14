import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, NotEquals, ValidateIf, ValidateNested } from "class-validator";
import { ConnectOfferDto, DisconnectOfferDto } from "./offers.dto";

export class UpdateProfileDto {
    @IsNotEmpty()
    @IsString()
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    title: string;

    @IsOptional()
    @IsString()
    country: string;

    @IsOptional()
    @IsString()
    city: string;

    @IsOptional()
    @IsString()
    address: string;

    @IsBoolean()
    @NotEquals(null)
    @ValidateIf((_, value) => value !== undefined)
    @Type(() => Boolean)
    isDefault: boolean;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ConnectOfferDto)
    connectOffers: ConnectOfferDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DisconnectOfferDto)
    disconnectOffers: DisconnectOfferDto[]
}