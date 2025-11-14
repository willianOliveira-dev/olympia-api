import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { uuidv7 } from 'uuidv7';
import { Prisma } from '@prisma/client';
import { count } from 'console';

interface FindAllOptions {
    where: any;
    skip?: number;
    take?: number;
    order?: 'asc' | 'desc';
    orderBy?: 'price' | 'createdAt';
}

@Injectable()
export class ProductsRespository {
    constructor(private readonly prisma: PrismaService) {}

    async existingSeller(sellerId: string) {
        const sellerCount = await this.prisma.seller.count({
            where: { id: sellerId },
        });

        return sellerCount > 0;
    }

    async sellerIsOwnerProduct(id: string, sellerId: string) {
        const productCount = await this.prisma.product.count({
            where: {
                id,
                sellerId,
            },
        });
        return productCount > 0;
    }

    async create(createProductDto: CreateProductDto, sellerId: string) {
        return await this.prisma.product.create({
            data: {
                id: uuidv7(),
                name: createProductDto.name,
                brand: createProductDto.brand,
                quantity: createProductDto.quantity,
                isFeatured: createProductDto.isFeatured ? true : false,
                discountPercentage: createProductDto.discountPercentage
                    ? createProductDto.discountPercentage
                    : null,
                discountEndDate: createProductDto.discountEndDate
                    ? createProductDto.discountEndDate
                    : null,
                price: createProductDto.price,
                description: createProductDto.description,
                seller: {
                    connect: {
                        id: sellerId,
                    },
                },
            },
        });
    }

    async validateCategoryIds({
        categories,
    }: CreateProductDto | UpdateProductDto) {
        if (!categories || categories.length === 0) return false;

        const found = await this.prisma.category.findMany({
            where: {
                id: {
                    in: categories,
                },
            },
            select: { id: true },
        });

        console.log(found);

        return found.length === categories?.length;
    }

    // Anexa as linhas na tabela ProductCategory
    async attachCategoriesToProduct(productId: string, categoryIds: string[]) {
        if (!categoryIds || categoryIds.length === 0) return;

        // build data Array
        const data = categoryIds.map((categoryId) => ({
            id: uuidv7(),
            productId,
            categoryId,
        }));

        // Usar createMany para performance
        await this.prisma.productCategory.createMany({
            data,
            skipDuplicates: true,
        });
    }

    // Busca geral com filtros
    async findAll({
        where,
        skip = 0,
        take = 45,
        order = 'asc',
        orderBy = 'createdAt',
    }: FindAllOptions) {
        const products = await this.prisma.product.findMany({
            where,
            skip,
            take,
            orderBy: {
                [orderBy]: orderBy === 'createdAt' ? 'desc' : order,
            },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                seller: true,
                productImage: true,
            },
        });

        const total = await this.prisma.product.count({ where });

        return { products, total };
    }

    // Buscar produtos do Vendedor
    async findBySeller(sellerId: string, skip: number, take: number) {
        const products = await this.prisma.product.findMany({
            where: {
                sellerId,
            },
            take,
            skip,
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                seller: true,
                productImage: true,
            },
        });

        const total = await this.prisma.product.count({ where: { sellerId } });
        return { products, total };
    }

    // Novos Lançamentos
    async findNew(take: number) {
        return this.prisma.product.findMany({
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                seller: true,
                productImage: true,
            },
        });
    }

    // Produtos em destque
    async findFeatured(take: number) {
        const today = new Date();

        return await this.prisma.product.findMany({
            take,
            orderBy: {
                updatedAt: 'desc',
            },
            where: {
                OR: [
                    {
                        isFeatured: true,
                    },
                    {
                        discountPercentage: {
                            not: null,
                        },
                        discountEndDate: {
                            gte: today,
                        },
                    },
                ],
            },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                seller: true,
                productImage: true,
            },
        });
    }

    // Produto individual
    async findOne(id: string) {
        return await this.prisma.product.findUnique({
            where: { id },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                seller: true,
                productImage: true,
            },
        });
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const { categories, ...productData } = updateProductDto;

        if (!categories) {
            return this.prisma.product.update({
                data: productData,
                where: { id },
            });
        }

        const operations: Prisma.PrismaPromise<any>[] = [];

        operations.push(
            this.prisma.product.update({
                where: { id },
                data: productData,
                include: {
                    categories: {
                        include: {
                            category: true,
                        },
                    },
                    seller: true,
                    productImage: true,
                },
            })
        );

        operations.push(
            this.prisma.productCategory.deleteMany({
                where: { productId: id },
            })
        );

        if (categories.length > 0) {
            const data = categories.map((categoryId) => ({
                id: uuidv7(),
                productId: id,
                categoryId,
            }));

            operations.push(
                this.prisma.productCategory.createMany({
                    data,
                    skipDuplicates: true,
                })
            );
        }

        const [productUpdated] = await this.prisma.$transaction(operations);

        return productUpdated;
    }

    async delete(id: string) {
        return await this.prisma.product.delete({ where: { id } });
    }
}
