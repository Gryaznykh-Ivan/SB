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

export class ReorderFeatureValueDto {
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
    values: CreateFeatureValueDto[]
}

export class UpdateFeatureDto {
    @IsInt()
    id: number;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReorderFeatureValueDto)
    reorderValues: ReorderFeatureValueDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFeatureValueDto)
    createValues: CreateFeatureValueDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateFeatureValueDto)
    updateValues: UpdateFeatureValueDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DeleteFeatureValueDto)
    deleteValues: DeleteFeatureValueDto[];
}

export class DeleteFeatureDto {
    @IsInt()
    id: number;
}

export class ReorderFeatureDto {
    @IsInt()
    id: number;
}