import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query, UploadedFiles, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Right, Role } from '@prisma/client';
import { Auth } from 'src/decorators/auth.decorator';
import { UpdateVariablesDto } from './dto/updateVariables.dto';
import { VariableService } from './variable.service';

@Controller('variables')
export class VariableController {

    constructor(
        private readonly variableService: VariableService
    ) { }

    @Get('search')
    @Auth([Role.ADMIN])
    getVariablesByGroup(
        @Query('group') group: string
    ) {
        return this.variableService.getVariablesByGroup(group)
    }

    @Put('update')
    @Auth([Role.ADMIN])
    updateVariable(
        @Body() data: UpdateVariablesDto
    ) {
        return this.variableService.updateVariables(data)
    }
}