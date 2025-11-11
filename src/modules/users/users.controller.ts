import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
    ApiCreatedResponse,
    ApiBody,
    ApiConflictResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponseComposition } from 'src/helpers/api-response';
import { UserEntity } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Listar Usuários
    @Get()
    @ApiOperation({ summary: 'Listar todos os usuários' })
    @ApiOkResponse({
        description: 'Usuários listados com sucesso.',
        type: ApiResponseComposition<UserEntity[]>({
            type: 'user',
            nameForSwagger: 'UserListSuccessResponse',
            message: 'Usuários encontrados com sucesso',
            statusCode: 200,
            isArray: true,
        }),
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao buscar os usuários.',
    })
    async findAllUsers() {
        const users = await this.usersService.findAll();
        return { message: 'Usuários encontrado com sucesso.', data: users };
    }

    // Buscar um único usuário
    @Get(':id')
    @ApiOperation({ summary: 'Buscar um único usuário' })
    @ApiOkResponse({
        description: 'Usuário encontrado com sucesso.',
        type: ApiResponseComposition<UserEntity>({
            type: 'user',
            nameForSwagger: 'UserFindOneSuccessResponse',
            message: 'Usuário encontrado com sucesso.',
            statusCode: 200,
        }),
    })
    @ApiBadRequestResponse({ description: 'O ID deve ser um UUIDv7 válido.' })
    @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao buscar o usuário.',
    })
    async findOneUser(
        @Param(
            'id',
            new ParseUUIDPipe({
                version: '7',
                exceptionFactory: () =>
                    new HttpException(
                        'O ID deve ser um UUIDv7 válido.',
                        HttpStatus.BAD_REQUEST
                    ),
            })
        )
        id: string
    ) {
        const user = await this.usersService.findOne(id);
        return { message: 'Usuário encontrado com sucesso.', data: user };
    }

    // Criar novo usuário
    @Post()
    @ApiOperation({ summary: 'Criar um novo usuário' })
    @ApiCreatedResponse({
        description: 'Usuário criado com sucesso.',
        type: ApiResponseComposition<UserEntity>({
            type: 'user',
            nameForSwagger: 'UserCreateSuccessResponse',
            message: 'Usuário criado com sucesso.',
            statusCode: 201,
        }),
    })
    @ApiBadRequestResponse({
        description: 'Os dados enviados estão incorretos.',
    })
    @ApiConflictResponse({
        description: 'O endereço de e-mail já existe.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao criar o usuário.',
    })
    async createUser(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        return { message: 'Usuário criado com sucesso.', data: user };
    }

    // Deletar um usuário
    @Delete(':id')
    @ApiOperation({ summary: 'Deletar um usuário específico' })
    @ApiOkResponse({
        description: 'Usuário removido com sucesso.',
        type: ApiResponseComposition<UserEntity>({
            type: 'user',
            nameForSwagger: 'UserDeleteSuccessResponse',
            message: 'Usuário removido com sucesso.',
            statusCode: 200,
        }),
    })
    @ApiBadRequestResponse({
        description: 'O ID deve ser um UUIDv7 válido.',
    })
    @ApiNotFoundResponse({
        description: 'Usuário não encontrado.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao remover o usuário.',
    })
    async deleteUser(
        @Param(
            'id',
            new ParseUUIDPipe({
                exceptionFactory: () =>
                    new HttpException(
                        'O ID deve ser um UUIDv7 válido.',
                        HttpStatus.BAD_REQUEST
                    ),
            })
        )
        id: string
    ) {
        const user = await this.usersService.delete(id);
        return { message: 'Usuário removido com sucesso', data: user };
    }
}
