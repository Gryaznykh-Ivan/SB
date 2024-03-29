import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { Right, Role } from '@prisma/client';
import { Auth } from 'src/decorators/auth.decorator';
import { CreateProfileDto } from './dto/createProfile.dto';
import { CreateDeliveryZoneDto, UpdateDeliveryZoneDto } from './dto/delivery.dto';
import { SearchProfileDto } from './dto/searchProfile.dto';
import { SearchZoneDto } from './dto/searchZone.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
    constructor(
        private readonly productService: ShippingService
    ) { }

    @Get('search')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.SHIPPING_READ])
    getProfilesBySearch(
        @Query(new ValidationPipe({ transform: true })) data: SearchProfileDto
    ) {
        return this.productService.getProfilesBySearch(data)
    }

    @Get(':profileId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.SHIPPING_READ])
    getProfileById(
        @Param('profileId', ParseIntPipe) profileId: number
    ) {
        return this.productService.getProfileById(profileId)
    }

    @Get(':profileId/getDeliveryZones')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.SHIPPING_READ])
    getDeliveryZones(
        @Param('profileId', ParseIntPipe) profileId: number,
        @Query(new ValidationPipe({ transform: true })) data: SearchZoneDto
    ) {
        return this.productService.getDeliveryZones(profileId, data)
    }


    @Post('create')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.SHIPPING_UPDATE])
    createProfile(
        @Body() data: CreateProfileDto
    ) {
        return this.productService.createProfile(data)
    }

    @Post(':profileId/createDeliveryZone')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.SHIPPING_UPDATE])
    createDeliveryZone(
        @Param('profileId', ParseIntPipe) profileId: number,
        @Body() data: CreateDeliveryZoneDto
    ) {
        return this.productService.createDeliveryZone(profileId, data)
    }

    @Put(':profileId/updateDeliveryZone/:zoneId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.SHIPPING_UPDATE])
    updateDeliveryZone(
        @Param('profileId', ParseIntPipe) profileId: number,
        @Param('zoneId', ParseIntPipe) zoneId: number,
        @Body() data: UpdateDeliveryZoneDto
    ) {
        return this.productService.updateDeliveryZone(profileId, zoneId, data)
    }


    @Delete(':profileId/removeDeliveryZone/:zoneId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.SHIPPING_UPDATE])
    removeDeliveryZone(
        @Param('zoneId', ParseIntPipe) zoneId: number,
    ) {
        return this.productService.removeDeliveryZone(zoneId)
    }

    @Put(':profileId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.SHIPPING_UPDATE])
    updateProfile(
        @Param('profileId', ParseIntPipe) profileId: number,
        @Body() data: UpdateProfileDto
    ) {
        return this.productService.updateProfile(profileId, data)
    }

    @Delete(':profileId')
    @Auth([Role.ADMIN, Role.MANAGER], [Right.SHIPPING_UPDATE])
    removeProfile(
        @Param('profileId', ParseIntPipe) profileId: number,
    ) {
        return this.productService.removeProfile(profileId)
    }
}