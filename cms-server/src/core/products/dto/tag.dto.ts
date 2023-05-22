import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";


export class CreateTagDto {
    @IsNotEmpty()
    @IsString()
    title: string;
}

export class DeleteTagDto {
    @IsInt()
    id: number;
}