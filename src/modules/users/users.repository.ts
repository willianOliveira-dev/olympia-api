import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<UserEntity[]> {
        return this.prisma.user.findMany({
            omit: {
                password: true,
            },
        });
    }

    async findOne(id: string): Promise<UserEntity | null> {
        return this.prisma.user.findUnique({
            omit: {
                password: true,
            },
            where: {
                id,
            },
        });
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async create(
        createUserDto: CreateUserDto & { id: string }
    ): Promise<UserEntity> {
        return this.prisma.user.create({
            omit: {
                password: true,
            },
            data: createUserDto,
        });
    }

    async delete(id: string): Promise<UserEntity | null> {
        return await this.prisma.user.delete({
            omit: {
                password: true,
            },
            where: {
                id,
            },
        });
    }
}
