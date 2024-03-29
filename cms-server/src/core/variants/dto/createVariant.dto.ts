import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, NotEquals, ValidateIf, ValidateNested } from "class-validator";

export class CreateVariantDto {
    @IsInt()
    productId: number;

    @IsNotEmpty()
    @IsString()
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    title: string;

    @IsDecimal()
    price: number;

    @IsOptional()
    @IsDecimal()
    compareAtPrice: number;

    @IsOptional()
    @IsString()
    sku: string;

    @IsOptional()
    @IsString()
    barcode: string;
}