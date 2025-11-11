import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AddressService } from './address.service';
import { AddressRepository } from './address.repository';
import { UsersModule } from '../users/users.module';
import { SellersModule } from '../sellers/sellers.module';
import { UsersAddressController } from './users-address.controller';
import { SellersAddressController } from './sellers-address.controller';

@Module({
    imports: [PrismaModule, UsersModule, SellersModule],
    controllers: [UsersAddressController, SellersAddressController],
    providers: [AddressService, AddressRepository],
})
export class AddressModule {}
