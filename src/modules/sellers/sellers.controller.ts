import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseUUIDPipe,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { SellerWithUserEntity } from './entities/seller.entity';
import { ApiResponseComposition } from 'src/helpers/api-response';

const userId = '019a5620-428c-7b28-a5db-9612e5ec52b9';

@ApiTags('sellers')
@Controller('sellers')
export class SellersController {
    constructor(private readonly sellersService: SellersService) {}

    // Listar Vendedores
    @Get()
    @ApiOperation({ summary: 'Listar todos os vendedores' })
    @ApiOkResponse({
        description: 'Vendedores listados com sucesso.',
        type: ApiResponseComposition<SellerWithUserEntity[]>({
            type: 'seller',
            nameForSwagger: 'SellerListSuccessResponse',
            message: 'Vendedores encontrados com sucesso.',
            statusCode: 200,
            isArray: true,
        }),
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao buscar os vendedores.',
    })
    async findAllSellers() {
        const sellerInfo = await this.sellersService.findAll();
        return {
            message: 'Vendedores encontrados com sucesso.',
            data: sellerInfo,
        };
    }

    // Buscar um único vendedor
    @Get(':id')
    @ApiOperation({ summary: 'Buscar um único vendedor' })
    @ApiOkResponse({
        description: 'Vendedor encontrado com sucesso.',
        type: ApiResponseComposition<SellerWithUserEntity>({
            type: 'seller',
            nameForSwagger: 'SellerFindOneSuccessResponse',
            message: 'Vendedor encontrado com sucesso.',
            statusCode: 200,
        }),
    })
    @ApiBadRequestResponse({ description: 'O ID deve ser um UUIDv7 válido.' })
    @ApiNotFoundResponse({ description: 'Vendedor não encontrado.' })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao buscar o vendedor.',
    })
    async findOneSeller(
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
        const seller = await this.sellersService.findOne(id);
        return { message: 'Vendedor encontrado com sucesso.', data: seller };
    }

    // Criar novo vendedor
    @Post()
    @ApiOperation({ summary: 'Criar um novo vendedor' })
    @ApiCreatedResponse({
        description: 'Vendedor criado com sucesso.',
        type: ApiResponseComposition<SellerWithUserEntity>({
            type: 'seller',
            nameForSwagger: 'SellerCreateSuccessResponse',
            message: 'Vendedor criado com sucesso.',
            statusCode: 201,
        }),
    })
    @ApiBadRequestResponse({
        description: 'Os dados enviados estão incorretos.',
    })
    @ApiConflictResponse({
        description: 'Usuário já possui uma loja, CNPJ já em uso por outra loja ou Usuário já está registrado como vendedor',
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao criar o vendedor.',
    })
    async createSeller(@Body() createSellerDto: CreateSellerDto) {
        const sellerInfo = await this.sellersService.create(
            createSellerDto,
            userId
        );
        return { message: 'Vendedor criado com sucesso.', data: sellerInfo };
    }

    // Atualizar vendedor
    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar um vendedor existente' })
    @ApiOkResponse({
        description: 'Vendedor atualizado com sucesso.',
        type: ApiResponseComposition<SellerWithUserEntity>({
            type: 'seller',
            nameForSwagger: 'SellerUpdateSuccessResponse',
            message: 'Vendedor atualizado com sucesso.',
            statusCode: 200,
        }),
    })
     @ApiConflictResponse({
        description: 'CNPJ já em uso por outra loja',
    })
    @ApiBadRequestResponse({ description: 'O ID deve ser um UUIDv7 válido.' })
    @ApiNotFoundResponse({ description: 'Vendedor não encontrado.' })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao atualizar o vendedor.',
    })
    async updateSeller(
        @Body() updateSellerDto: UpdateSellerDto,
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
        const sellerInfo = await this.sellersService.update(
            updateSellerDto,
            id
        );
        return {
            message: 'Vendedor atualizado com sucesso.',
            data: sellerInfo,
        };
    }

    // Deletar vendedor
    @Delete(':id')
    @ApiOperation({ summary: 'Deletar um vendedor específico' })
    @ApiOkResponse({
        description: 'Vendedor removido com sucesso.',
        type: ApiResponseComposition<SellerWithUserEntity>({
            type: 'seller',
            nameForSwagger: 'SellerDeleteSuccessResponse',
            message: 'Vendedor removido com sucesso.',
            statusCode: 200,
        }),
    })
    @ApiBadRequestResponse({ description: 'O ID deve ser um UUIDv7 válido.' })
    @ApiNotFoundResponse({ description: 'Vendedor não encontrado.' })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao remover o vendedor.',
    })
    async deleteSeller(
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
        const sellerInfo = await this.sellersService.delete(id, userId);
        return { message: 'Vendedor removido com sucesso.', data: sellerInfo };
    }
}
