import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';
import { SellersRepository } from './sellers.repository';

@Module({
    imports: [PrismaModule, UsersModule],
    controllers: [SellersController],
    providers: [SellersService, SellersRepository],
    exports: [SellersService]
})
export class SellersModule {}
