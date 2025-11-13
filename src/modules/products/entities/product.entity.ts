import { Product } from '@prisma/client';

export class ProductEntity implements Product {
    readonly id: string;
    readonly name: string;
    readonly brand: string;
    readonly quantity: number;
    readonly isFeatured: boolean;
    readonly discountEndDate: Date | null;
    readonly discountPercentage: number | null;
    readonly description: string;
    readonly price: number;
    readonly sellerId: string;
    readonly categories?: string[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
