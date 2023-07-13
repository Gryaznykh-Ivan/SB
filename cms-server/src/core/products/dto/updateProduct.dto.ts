import { Transform, TransformFnParams, Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, NotEquals, ValidateIf, ValidateNested } from "class-validator";
import { ConnectCollectionDto, DisconnectCollectionDto } from "./collections.dto";
import { CreateFeatureDto, DeleteFeatureDto, ReorderFeatureDto, UpdateFeatureDto } from "./features.dto";
import { CreateMetafieldDto, DeleteMetafieldDto, UpdateMetafieldDto } from "./metafields.dto";
import { CreateTagDto, DeleteTagDto } from "./tag.dto";

export class UpdateProductDto {
    @IsNotEmpty()
    @IsString()
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    @MaxLength(255, { message: "Название слишком длинное"})
    title: string;

    @IsNotEmpty()
    @IsString()
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    @MaxLength(255, { message: "Ручка слишком длинная"})
    handle: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    @MaxLength(255, { message: "Название слишком длинное"})
    metaTitle: string;

    @IsNotEmpty()
    @IsString()
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
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
    @Type(() => DisconnectCollectionDto)
    disconnectCollections: DisconnectCollectionDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMetafieldDto)
    createMetafields: CreateMetafieldDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateMetafieldDto)
    updateMetafields: UpdateMetafieldDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DeleteMetafieldDto)
    deleteMetafields: DeleteMetafieldDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTagDto)
    createTags: CreateTagDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DeleteTagDto)
    deleteTags: DeleteTagDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReorderFeatureDto)
    reorderFeatures: ReorderFeatureDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFeatureDto)
    createFeatures: CreateFeatureDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateFeatureDto)
    updateFeatures: UpdateFeatureDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DeleteFeatureDto)
    deleteFeatures: DeleteFeatureDto[]
}