import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class UsersService {
    constructor(private readonly repo: UsersRepository) {}

    async findAll() {
        const users = await this.repo.findAll();
        return { user: users };
    }

    async findOne(id: string) {
        const user = await this.repo.findOne(id);
        if (!user) {
            throw new HttpException(
                'Usuário não encontrado.',
                HttpStatus.NOT_FOUND
            );
        }
        return { user };
    }

    async create(createUserDto: CreateUserDto) {
        const existingEmail = await this.repo.findByEmail(createUserDto.email);

        if (existingEmail) {
            throw new HttpException(
                'O endereço de e-mail já existe.',
                HttpStatus.CONFLICT
            );
        }
        const password: string = createUserDto.password;

        const UserWithEncryptedPassword = {
            id: uuidv7(),
            ...createUserDto,
            password: await hash(password, 10),
        };

        const newUser = await this.repo.create(UserWithEncryptedPassword);

        return { user: newUser };
    }

    async delete(id: string) {
        await this.findOne(id);
        const user = await this.repo.delete(id);
        return { user };
    }
}
