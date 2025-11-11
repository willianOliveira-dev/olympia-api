import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { SellersRepository } from './sellers.repository';
import { uuidv7 } from 'uuidv7';
import { UsersService } from '../users/users.service';
import { UpdateSellerDto } from './dto/update-seller.dto';

@Injectable()
export class SellersService {
    constructor(
        private readonly repo: SellersRepository,
        private readonly usersService: UsersService
    ) {}

    async findAll() {
        const sellers = await this.repo.findAll();
        return { seller: sellers };
    }

    async findOne(id: string) {
        const seller = await this.repo.findOne(id);
        if (!seller) {
            throw new HttpException(
                'Vendedor não encontrado.',
                HttpStatus.NOT_FOUND
            );
        }
        return { seller };
    }

    async create(createSellerDto: CreateSellerDto, userId: string) {
        const existingUser = await this.repo.findByUserId(userId);

        if (existingUser)
            throw new HttpException(
                'Usuário já possui uma loja.',
                HttpStatus.CONFLICT
            );

        const existingCnpj = await this.repo.findByCnpj(createSellerDto.cnpj);

        if (existingCnpj)
            throw new HttpException(
                'CNPJ já em uso por outra loja.',
                HttpStatus.CONFLICT
            );

        const findUser = await this.usersService.findOne(userId);

        const userIsSeller = findUser.user.isSeller;

        if (userIsSeller)
            throw new HttpException(
                'Usuário já está registrado como vendedor.',
                HttpStatus.CONFLICT
            );

        const newSeller = {
            id: uuidv7(),
            ...createSellerDto,
            userId,
        };

        const seller = await this.repo.create(newSeller);

        return { seller };
    }

    async update(updateSellerDto: UpdateSellerDto, id: string) {
        await this.findOne(id);

        const hasCnpj = updateSellerDto.cnpj;

        if (hasCnpj) {
            const existingCnpj = await this.repo.findByCnpj(hasCnpj);
            if (existingCnpj) {
                throw new HttpException(
                    'CNPJ já em uso por outra loja.',
                    HttpStatus.CONFLICT
                );
            }
        }

        const seller = await this.repo.update(updateSellerDto, id);

        return { seller };
    }

    async delete(id: string, userId: string) {
        await this.findOne(id);
        const seller = await this.repo.delete(id, userId);
        return { seller };
    }
}
