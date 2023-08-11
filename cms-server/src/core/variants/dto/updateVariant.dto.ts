import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, NotEquals, ValidateIf, ValidateNested } from "class-validator";

export class UpdateVariantDto {
    @IsNotEmpty()
    @IsString()
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    title: string;

    @IsOptional()
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