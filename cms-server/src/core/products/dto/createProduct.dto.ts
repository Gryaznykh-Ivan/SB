import { Transform, TransformFnParams, Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, Length, maxLength, MaxLength, NotEquals, ValidateIf, ValidateNested } from "class-validator";
import { ConnectCollectionDto } from "./collections.dto";
import { CreateFeatureDto } from "./features.dto";
import { CreateTagDto, DeleteTagDto } from "./tag.dto";

export class CreateProductDto {
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
    @IsBoolean()
    available: boolean;

    @IsOptional()
    @IsString()
    vendor: string;

    @IsOptional()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    barcode: string;

    @IsOptional()
    @IsString()
    sku: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ConnectCollectionDto)
    connectCollections: ConnectCollectionDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTagDto)
    createTags: CreateTagDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFeatureDto)
    createFeatures: CreateFeatureDto[]
}