import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressEntity } from './entities/address.entity';

export type OwnerTypeOptions = 'user' | 'seller';

@Injectable()
export class AddressRepository {
    constructor(private readonly prisma: PrismaService) {}

    getOwnerField(ownerType: OwnerTypeOptions) {
        return ownerType === 'user' ? 'userId' : 'sellerId';
    }

    async findAll(
        ownerId: string,
        ownerType: OwnerTypeOptions
    ): Promise<AddressEntity[]> {
        const ownerField = this.getOwnerField(ownerType);
        return await this.prisma.address.findMany({
            where: {
                [ownerField]: ownerId,
            },
        });
    }

    async findOne(
        addressId: string,
        ownerId: string,
        ownerType: OwnerTypeOptions
    ): Promise<AddressEntity | null> {
        const ownerField = this.getOwnerField(ownerType);

        return await this.prisma.address.findFirst({
            where: {
                id: addressId,
                [ownerField]: ownerId,
            },
        });
    }

    async hasDefaultAddress(ownerId: string, ownerType: OwnerTypeOptions) {
        const ownerField = this.getOwnerField(ownerType);
        const addressCount = await this.prisma.address.count({
            where: {
                [ownerField]: ownerId,
                isDefault: true,
            },
        });

        return addressCount > 0;
    }

    async create(
        createAddressDto: CreateAddressDto & { id: string }
    ): Promise<AddressEntity> {
        return await this.prisma.address.create({
            data: createAddressDto,
        });
    }

    async update(
        UpdateAddressDto: UpdateAddressDto,
        addressId: string
    ): Promise<AddressEntity | null> {
        return await this.prisma.address.update({
            data: UpdateAddressDto,
            where: {
                id: addressId,
            },
        });
    }

    async delete(addressId: string): Promise<AddressEntity | null> {
        return await this.prisma.address.delete({
            where: {
                id: addressId,
            },
        });
    }
}
