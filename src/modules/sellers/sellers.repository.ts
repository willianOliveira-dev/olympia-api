import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { SellerWithUserEntity } from './entities/seller.entity';

@Injectable()
export class SellersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<SellerWithUserEntity[]> {
        return await this.prisma.seller.findMany({
            include: {
                user: {
                    omit: {
                        password: true,
                    },
                },
            },
        });
    }

    async findOne(id: string): Promise<SellerWithUserEntity | null> {
        return this.prisma.seller.findUnique({
            where: {
                id,
            },
            include: {
                user: true,
            },
        });
    }

    async findByUserId(userId: string): Promise<SellerWithUserEntity | null> {
        return this.prisma.seller.findUnique({
            where: {
                userId,
            },
            include: {
                user: true,
            },
        });
    }

    async findByCnpj(cnpj: string): Promise<SellerWithUserEntity | null> {
        return this.prisma.seller.findUnique({
            where: {
                cnpj,
            },
            include: {
                user: true,
            },
        });
    }

    async create(
        createSellerDto: CreateSellerDto & { id: string; userId: string }
    ): Promise<SellerWithUserEntity> {
        const [seller, _] = await this.prisma.$transaction([
            this.prisma.seller.create({
                data: createSellerDto,
                include: {
                    user: {
                        omit: {
                            password: true,
                        },
                    },
                },
            }),
            this.prisma.user.update({
                where: {
                    id: createSellerDto.userId,
                },
                data: {
                    role: 'SELLER',
                    isSeller: true,
                    sellerId: createSellerDto.id,
                },
            }),
        ]);

        return seller;
    }

    async update(
        updateSellerDto: UpdateSellerDto,
        id: string
    ): Promise<SellerWithUserEntity | null> {
        return this.prisma.seller.update({
            where: { id },
            data: updateSellerDto,
            include: {
                user: {
                    omit: {
                        password: true,
                    },
                },
            },
        });
    }

    async delete(id: string, userId: string): Promise<SellerWithUserEntity> {
        const [seller, _] = await this.prisma.$transaction([
            this.prisma.seller.delete({
                where: {
                    id,
                },
                include: {
                    user: {
                        omit: {
                            password: true,
                        },
                    },
                },
            }),
            this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    sellerId: null,
                    isSeller: false,
                    role: 'USER',
                },
            }),
        ]);

        return seller;
    }
}
