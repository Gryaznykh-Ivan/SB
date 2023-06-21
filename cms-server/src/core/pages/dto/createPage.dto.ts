import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreatePageDto {
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

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    content: string;

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(255, { message: "Название слишком длинное"})
    metaTitle: string;

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    metaDescription: string;
}