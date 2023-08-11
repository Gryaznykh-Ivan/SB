import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { Right, Role } from '@prisma/client';
import { Auth } from 'src/decorators/auth.decorator';
import { CreateVariantDto } from './dto/createVariant.dto';
import { SearchVariantDto } from './dto/searchVariant.dto';
import { UpdateVariantDto } from './dto/updateVariant.dto';
import { VariantService } from './variant.service';

@Controller('variants')
export class VariantController {

    constructor(
        private readonly variantService: VariantService
    ) { }


    @Get('search')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_READ])
    getVariantsBySearch(
        @Query(new ValidationPipe({ transform: true })) data: SearchVariantDto
    ) {
        return this.variantService.getVariantsBySearch(data)
    }



    @Get('getPreview/:variantId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_READ])
    getPreview(
        @Param('variantId', ParseIntPipe) variantId: number
    ) {
        return this.variantService.getPreview(variantId)
    }

    @Get('getAll/:productId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_READ])
    getVariants(
        @Param('productId', ParseIntPipe) productId: number
    ) {
        return this.variantService.getVariants(productId)
    }

    @Get(':variantId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_READ])
    getVariantById(
        @Param('variantId', ParseIntPipe) variantId: number
    ) {
        return this.variantService.getVariantById(variantId)
    }


    @Post('create')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_UPDATE])
    createVariant(
        @Body() data: CreateVariantDto
    ) {
        return this.variantService.createVariant(data)
    }

    @Put(':variantId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_UPDATE])
    updateVariant(
        @Param('variantId', ParseIntPipe) variantId: number,
        @Body() data: UpdateVariantDto
    ) {
        return this.variantService.updateVariant(variantId, data)
    }

    @Delete(':variantId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_UPDATE])
    removeVariant(
        @Param('variantId', ParseIntPipe) variantId: number,
    ) {
        return this.variantService.removeVariant(variantId)
    }
}