import { OfferStatus } from "@prisma-store";
import { Type } from "class-transformer";
import { IsArray, IsDecimal, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class CreateOfferDto {
    @IsNotEmpty()
    @IsString()
    variantId: number;

    @IsDecimal()
    price: number;

    @IsDecimal()
    offerPrice: number;

    @IsOptional()
    @IsDecimal()
    compareAtPrice: number;

    @IsOptional()
    @IsString()
    comment: string;

    @IsOptional()
    @IsEnum(OfferStatus, { each: true })
    status: OfferStatus;

    @IsOptional()
    @IsString()
    deliveryProfileId: number;

    @IsOptional()
    @IsString()
    userId: number;
}