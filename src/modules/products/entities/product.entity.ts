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
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly seller: {
        readonly id: string;
        readonly cnpj: string;
        readonly storeName: string;
        readonly municipalRegistration: string | null;
        readonly stateRegistration: string;
        readonly phoneNumber: string | null;
        readonly taxRegime: string;
        readonly website: string | null;
        readonly businessEmail: string | null;
        readonly companyName: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly userId: string;
    };
    readonly categories: [
        {
            id: string;
            productId: string;
            categoryId: string;
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            };
        }
    ];
    readonly productImage: [
        {
            id: string;
            url: string;
            altText: string;
            productId: string;
            order: number;
            createdAt: Date;
        }
    ];
}
