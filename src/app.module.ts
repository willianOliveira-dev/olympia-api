import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { AddressModule } from './modules/address/address.module';

@Module({
    imports: [UsersModule, SellersModule, AddressModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
