import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddressRepository, OwnerTypeOptions } from './address.repository';
import { uuidv7 } from 'uuidv7';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
    constructor(private readonly repo: AddressRepository) {}

    async findAll(ownerId: string, ownerType: OwnerTypeOptions) {
        const address = await this.repo.findAll(ownerId, ownerType);
        return { address };
    }

    async findOne(
        addressId: string,
        ownerId: string,
        ownerType: OwnerTypeOptions
    ) {
        const address = await this.repo.findOne(addressId, ownerId, ownerType);

        if (!address) {
            throw new HttpException(
                'Endereço não encontrado.',
                HttpStatus.NOT_FOUND
            );
        }
        return { address };
    }

    async create(
        createAddressDto: CreateAddressDto,
        ownerId: string,
        ownerType: OwnerTypeOptions
    ) {
        const ownerField = this.repo.getOwnerField(ownerType);

        const newAddress = {
            id: uuidv7(),
            ...createAddressDto,
            [ownerField]: ownerId,
        };

        const address = await this.repo.create(newAddress);

        return { address };
    }

    async update(
        updateAddressDto: UpdateAddressDto,
        addressId: string,
        ownerId: string,
        ownerType: OwnerTypeOptions
    ) {
        await this.findOne(addressId, ownerId, ownerType);
        const address = await this.repo.update(updateAddressDto, addressId);
        return { address };
    }

    async delete(
        addressId: string,
        ownerId: string,
        ownerType: OwnerTypeOptions
    ) {
        await this.findOne(addressId, ownerId, ownerType);
        const address = await this.repo.delete(addressId);
        return { address };
    }
}
