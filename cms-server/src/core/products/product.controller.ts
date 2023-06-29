import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query, UploadedFiles, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Right, Role } from '@prisma/client';
import { Auth } from 'src/decorators/auth.decorator';
import { Token } from 'src/decorators/token.decorator';
import { ParseBooleanPipe } from 'src/pipes/parse-boolean.pipe';
import { CreateProductDto } from './dto/createProduct.dto';
import { CreateFeatureDto, ReorderFeatureValueDto, UpdateFeatureDto } from './dto/features.dto';
import { SearchProductDto } from './dto/searchProduct.dto';
import { UpdateImageDto } from './dto/updateImage.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {

    constructor(
        private readonly productService: ProductService
    ) { }

    @Get('search')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_READ])
    getProductsBySearch(
        @Query(new ValidationPipe({ transform: true })) data: SearchProductDto
    ) {
        return this.productService.getProductsBySearch(data)
    }

    @Get(':productId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_READ])
    getProductById(
        @Param('productId', ParseIntPipe) productId: number
    ) {
        return this.productService.getProductById(productId)
    }


    @Post('create')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_UPDATE])
    createProduct(
        @Body() data: CreateProductDto
    ) {
        return this.productService.createProduct(data)
    }

    @Post(':productId/uploadImages')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_UPDATE, Right.MEDIA_UPLOAD])
    @UseInterceptors(FilesInterceptor('images'))
    uploadImages(
        @Param('productId', ParseIntPipe) productId: number,
        @UploadedFiles() images: Express.Multer.File[],
    ) {
        return this.productService.uploadImages(productId, images)
    }

    @Put(':productId/updateImage/:imageId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_UPDATE])
    updateImage(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('imageId', ParseIntPipe) imageId: number,
        @Body() data: UpdateImageDto
    ) {
        return this.productService.updateImage(productId, imageId, data)
    }

    @Delete(':productId/removeImage/:imageId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_UPDATE, Right.MEDIA_DELETE])
    removeImage(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('imageId', ParseIntPipe) imageId: number,
    ) {
        return this.productService.removeImage(productId, imageId)
    }

    @Post(':productId/createFeature')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_UPDATE])
    createFeature(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() data: CreateFeatureDto
    ) {
        return this.productService.createFeature(productId, data)
    }

    @Put(':productId/updateFeature/:featureId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_UPDATE])
    updateFeature(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('featureId', ParseIntPipe) featureId: number,
        @Body() data: UpdateFeatureDto
    ) {
        return this.productService.updateFeature(productId, featureId, data)
    }


    @Delete(':productId/removeFeature/:featureId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_UPDATE])
    removeFeature(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('featureId', ParseIntPipe) featureId: number,
    ) {
        return this.productService.removeFeature(productId, featureId)
    }

    @Put(':productId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_UPDATE])
    updateProduct(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() data: UpdateProductDto
    ) {
        return this.productService.updateProduct(productId, data)
    }

    @Delete(':productId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.PRODUCT_UPDATE])
    removeProduct(
        @Param('productId', ParseIntPipe) productId: number,
    ) {
        return this.productService.removeProduct(productId)
    }
}