import { Module } from '@nestjs/common';
import { CollectionModule } from './collections/collection.module';
import { OfferModule } from './offers/offer.module';
import { OrderModule } from './orders/order.module';
import { PageModule } from './pages/page.module';
import { ProductModule } from './products/product.module';
import { VariableModule } from './variables/variable.module';
import { ShippingModule } from './shipping/shipping.module';
import { SuggestionModule } from './suggestions/suggestion.module';
import { UserModule } from './users/user.module';
import { VariantModule } from './variants/variant.module';

@Module({
    imports: [
        ProductModule,
        VariantModule,
        CollectionModule,
        UserModule,
        OfferModule,
        ShippingModule,
        SuggestionModule,
        OrderModule,
        PageModule,
        VariableModule
    ],
})
export class CoreModule { }