import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Right, Role } from '@prisma/client';
import { Auth } from 'src/decorators/auth.decorator';
import { Token } from 'src/decorators/token.decorator';
import { CreateCollectionDto } from './dto/createCollection.dto';
import { UpdateImageDto } from './dto/updateImage.dto';
import { UpdateCollectionDto } from './dto/updateCollection.dto';
import { CollectionService } from './collection.service';
import { ParseBooleanPipe } from 'src/pipes/parse-boolean.pipe';

@Controller('collections')
export class CollectionController {

    constructor(
        private readonly collectionService: CollectionService
    ) { }

    @Get('search')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.COLLECTION_READ])
    getCollectionsBySearch(
        @Query('q') q: string,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    ) {
        return this.collectionService.getCollectionsBySearch(q, limit, skip)
    }

    @Get(':collectionId/getProducts')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.COLLECTION_READ])
    getCollectionProducts(
        @Param('collectionId', ParseIntPipe) collectionId: number,
        @Query('q') q: string,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    ) {
        return this.collectionService.getCollectionProducts(collectionId, q, limit, skip)
    }

    @Get(':collectionId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.COLLECTION_READ])
    getCollectionById(
        @Param('collectionId', ParseIntPipe) collectionId: number
    ) {
        return this.collectionService.getCollectionById(collectionId)
    }


    @Post('create')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.COLLECTION_UPDATE])
    createCollection(
        @Body() data: CreateCollectionDto
    ) {
        return this.collectionService.createCollection(data)
    }

    @Post(':collectionId/uploadImages')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.COLLECTION_UPDATE, Right.MEDIA_UPLOAD])
    @UseInterceptors(FilesInterceptor('images'))
    uploadImages(
        @Param('collectionId', ParseIntPipe) collectionId: number,
        @UploadedFiles() images: Express.Multer.File[],
    ) {
        return this.collectionService.uploadImages(collectionId, images)
    }

    @Put(':collectionId/updateImage/:imageId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.COLLECTION_UPDATE])
    updateImage(
        @Param('collectionId', ParseIntPipe) collectionId: number,
        @Param('imageId', ParseIntPipe) imageId: number,
        @Body() data: UpdateImageDto
    ) {
        return this.collectionService.updateImage(collectionId, imageId, data)
    }

    @Delete(':collectionId/removeImage/:imageId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.COLLECTION_UPDATE, Right.MEDIA_DELETE])
    removeImage(
        @Param('collectionId', ParseIntPipe) collectionId: number,
        @Param('imageId', ParseIntPipe) imageId: number,
    ) {
        return this.collectionService.removeImage(collectionId, imageId)
    }

    @Put(':collectionId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.COLLECTION_UPDATE])
    updateCollection(
        @Param('collectionId', ParseIntPipe) collectionId: number,
        @Body() data: UpdateCollectionDto
    ) {
        return this.collectionService.updateCollection(collectionId, data)
    }

    @Delete(':collectionId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.COLLECTION_UPDATE])
    removeCollection(
        @Param('collectionId', ParseIntPipe) collectionId: number,
    ) {
        return this.collectionService.removeCollection(collectionId)
    }
}