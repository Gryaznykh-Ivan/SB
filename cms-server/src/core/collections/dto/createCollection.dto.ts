import { Transform, TransformFnParams, Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, NotEquals, ValidateIf, ValidateNested } from "class-validator";
import { ConnectProductDto } from "./products.dto";

export class CreateCollectionDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(255, { message: "Название слишком длинное"})
    title: string;

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(255, { message: "Ручка слишком длинная"})
    handle: string;

    @IsBoolean()
    @NotEquals(null)
    @ValidateIf((_, value) => value !== undefined)
    @Type(() => Boolean)
    hidden: boolean;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(255, { message: "Название слишком длинное"})
    metaTitle: string;

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    metaDescription: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ConnectProductDto)
    connectProducts: ConnectProductDto[]
}