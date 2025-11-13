import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductsRespository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from 'src/common/dto/product-filter.dto';
import { ProductFilterLimitDto } from 'src/common/dto/productFilterLimit.dto';

const DEFAULT_LIMIT = 45;
const MAX_LIMIT = 60;

@Injectable()
export class ProductsService {
    constructor(private readonly repo: ProductsRespository) {}

    private normalizeLimit(limit?: number) {
        const l = limit ?? DEFAULT_LIMIT;
        return Math.min(l, MAX_LIMIT);
    }

    async sellerIsOwnerProduct(id: string, sellerId: string) {
        const isOwner = await this.repo.sellerIsOwnerProduct(id, sellerId);
        if (!isOwner) {
            throw new HttpException(
                'Você não possui autorização para modificar esse produto',
                HttpStatus.FORBIDDEN
            );
        }
    }

    async existingSeller(sellerId: string) {
        const existingSeller = await this.repo.existingSeller(sellerId);

        if (!existingSeller) {
            throw new HttpException(
                'Vendedor não encontrado',
                HttpStatus.NOT_FOUND
            );
        }
    }

    async create(createProductDto: CreateProductDto, sellerId: string) {
        await this.existingSeller(sellerId);

        const { categories } = createProductDto;

        const categoryIdsAreValid = await this.repo.validateCategoryIds({
            categories,
        });

        if (!categoryIdsAreValid) {
            throw new HttpException(
                'Alguma categoria enviada não existe',
                HttpStatus.NOT_FOUND
            );
        }

        const productCreated = await this.repo.create(
            createProductDto,
            sellerId
        );

        await this.repo.attachCategoriesToProduct(
            productCreated.id,
            categories
        );

        const product = await this.repo.findOne(productCreated.id);

        return { product };
    }

    async findAll(filter: ProductFilterDto) {
        const offset = filter.offset ?? 0;
        const limit = this.normalizeLimit(filter.limit);

        const where: any = {};

        if (filter.q) {
            where.OR = [
                {
                    name: { contains: filter.q, mode: 'insensitive' },
                },
                {
                    description: { contains: filter.q, mode: 'insensitive' },
                },
            ];
        }

        if (filter.minPrice || filter.maxPrice) {
            where.price = {};

            if (filter.minPrice) where.price.gte = filter.minPrice;
            if (filter.maxPrice) where.price.lte = filter.maxPrice;
        }

        if (filter.categoryId) {
            where.categories = { some: { categoryId: filter.categoryId } };
        }

        const { products, total } = await this.repo.findAll({
            where,
            skip: offset,
            take: limit,
            order: filter.order as 'asc' | 'desc',
            orderBy: filter.orderBy as 'price' | 'createdAt',
        });

        return { product: products, total, offset, limit };
    }

    async findNew({ limit }: ProductFilterLimitDto) {
        const take = this.normalizeLimit(limit);
        const product = await this.repo.findNew(take);
        return { product };
    }

    async findFeatured({ limit }: ProductFilterLimitDto) {
        const take = this.normalizeLimit(limit);
        const product = await this.repo.findFeatured(take);
        return { product };
    }

    async findOne(id: string) {
        const product = await this.repo.findOne(id);
        if (!product)
            throw new HttpException(
                'Produto não encontrado',
                HttpStatus.NOT_FOUND
            );
        return { product };
    }

    async update(dto: UpdateProductDto, id: string, sellerId: string) {
        await this.existingSeller(sellerId);
        await this.sellerIsOwnerProduct(id, sellerId);
        await this.findOne(id);
        const product = await this.repo.update(id, dto);
        return { product };
    }

    async delete(id: string, sellerId: string) {
        await this.existingSeller(sellerId);
        await this.sellerIsOwnerProduct(id, sellerId);
        await this.findOne(id);
        const product = await this.repo.delete(id);
        return { product };
    }
}
