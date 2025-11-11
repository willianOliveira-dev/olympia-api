import { $Enums, Prisma } from '@prisma/client';

type SellerWithUserPayload = Prisma.SellerGetPayload<{
    include: {
        user: {
            omit: {
                password: true;
            };
        };
    };
}>;

export class SellerWithUserEntity implements SellerWithUserPayload {
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
    readonly user: {
        readonly id: string;
        readonly email: string;
        readonly username: string;
        readonly firstName: string | null;
        readonly lastName: string | null;
        readonly avatar: string | null;
        readonly emailVerified: Date | null;
        readonly phone: string | null;
        readonly role: $Enums.Role;
        readonly isSeller: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly sellerId: string | null;
    };
}
