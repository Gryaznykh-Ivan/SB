import { Transform, TransformFnParams, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, NotEquals, ValidateIf, ValidateNested } from "class-validator";


export class CreateFeatureValueDto {
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    key: string;

    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    value: string;
}

export class UpdateFeatureValueDto {
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsString()
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    key: string;

    @IsNotEmpty()
    @IsString()
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    value: string;
}

export class DeleteFeatureValueDto {
    @IsInt()
    id: number;
}

export class CreateFeatureDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty({ each: true })
    @ArrayMinSize(1)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFeatureValueDto)
    createFeatureValues: CreateFeatureValueDto[]
}

export class ReorderFeatureValueDto {
    @IsInt()
    id: number;

    @IsInt()
    position: number;
}

export class UpdateFeatureDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsInt()
    position: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => ReorderFeatureValueDto)
    reorderFeatureValue: ReorderFeatureValueDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFeatureValueDto)
    createFeatureValues: CreateFeatureValueDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateFeatureValueDto)
    updateFeatureValues: UpdateFeatureValueDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DeleteFeatureValueDto)
    deleteFeatureValues: DeleteFeatureValueDto[];
}