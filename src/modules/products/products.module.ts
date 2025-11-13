import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsRespository } from './products.repository';

@Module({
    imports: [PrismaModule],
    controllers: [ProductsController],
    providers: [ProductsService, ProductsRespository]
})

export class ProductsModule {}