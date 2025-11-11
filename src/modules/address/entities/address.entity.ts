import { Address } from '@prisma/client';

export class AddressEntity implements Address {
    id: string;
    landlord: string;
    phoneNumber: string;
    label: string;
    street: string;
    number: number;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string | null;
    sellerId: string | null;
}
