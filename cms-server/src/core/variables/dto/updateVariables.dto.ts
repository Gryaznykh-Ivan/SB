import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, NotEquals, ValidateIf, ValidateNested } from "class-validator";


export class VariableDto {
    @IsNotEmpty()
    @IsString()
    group: string;

    @IsNotEmpty()
    @IsString()
    key: string;

    @IsString()
    @NotEquals(null)
    @ValidateIf((object, value) => value !== undefined)
    value: string;
}

export class UpdateVariablesDto {
    @ArrayMinSize(1)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VariableDto)
    updateVariables: VariableDto[];
}