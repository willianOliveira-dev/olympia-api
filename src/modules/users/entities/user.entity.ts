import { $Enums, User } from '@prisma/client';

type UserWithoutPassword = Omit<User, 'password'>;

export class UserEntity implements UserWithoutPassword {
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
}
