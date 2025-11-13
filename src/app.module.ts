import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { AddressModule } from './modules/address/address.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
    imports: [UsersModule, SellersModule, AddressModule, ProductsModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
