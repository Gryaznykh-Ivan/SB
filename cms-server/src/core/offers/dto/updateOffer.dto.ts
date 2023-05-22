import { OfferStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsDecimal, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, NotEquals, ValidateIf, ValidateNested } from "class-validator";

export class UpdateOfferDto {
    @IsInt()
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    variantId: number;

    @IsOptional()
    @IsDecimal()
    price: number;

    @IsOptional()
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

    @IsInt()
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    deliveryProfileId: number;

    @IsInt()
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    userId: number;
}