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
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressEntity } from './entities/address.entity';
import { ApiResponseComposition } from 'src/helpers/api-response';

const sellerId = '019a7f51-1b89-7fa5-9351-246a73d841f7';

@ApiTags('sellers-address')
@Controller('sellers/address')
export class SellersAddressController {
    constructor(private readonly addressService: AddressService) {}

    // Listar endereços do vendedor
    @Get()
    @ApiOperation({ summary: 'Listar todos os endereços do vendedor' })
    @ApiOkResponse({
        description: 'Endereços listados com sucesso.',
        type: ApiResponseComposition<AddressEntity[]>({
            type: 'address',
            nameForSwagger: 'SellerAddressListSuccessResponse',
            message: 'Endereços encontrados com sucesso.',
            statusCode: 200,
            isArray: true,
        }),
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao buscar os endereços.',
    })
    async findAllAddress() {
        const address = await this.addressService.findAll(sellerId, 'seller');
        return { message: 'Endereços encontrados com sucesso.', data: address };
    }

    // Buscar um único endereço
    @Get(':id')
    @ApiOperation({ summary: 'Buscar um único endereço do vendedor' })
    @ApiOkResponse({
        description: 'Endereço encontrado com sucesso.',
        type: ApiResponseComposition<AddressEntity>({
            type: 'address',
            nameForSwagger: 'SellerAddressFindOneSuccessResponse',
            message: 'Endereço encontrado com sucesso.',
            statusCode: 200,
        }),
    })
    @ApiBadRequestResponse({ description: 'O ID deve ser um UUIDv7 válido.' })
    @ApiNotFoundResponse({ description: 'Endereço não encontrado.' })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao buscar o endereço.',
    })
    async findOneAddress(
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
        const address = await this.addressService.findOne(
            id,
            sellerId,
            'seller'
        );
        return { message: 'Endereço encontrado com sucesso.', data: address };
    }

    // Criar novo endereço
    @Post()
    @ApiOperation({ summary: 'Criar um novo endereço para o vendedor' })
    @ApiCreatedResponse({
        description: 'Endereço criado com sucesso.',
        type: ApiResponseComposition<AddressEntity>({
            type: 'address',
            nameForSwagger: 'SellerAddressCreateSuccessResponse',
            message: 'Endereço criado com sucesso.',
            statusCode: 201,
        }),
    })
    @ApiConflictResponse({
        description: 'Não é possível ter mais de um endereço padrão.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao criar o endereço.',
    })
    async createAddress(@Body() createAddressDto: CreateAddressDto) {
        const address = await this.addressService.create(
            createAddressDto,
            sellerId,
            'seller'
        );
        return { message: 'Endereço criado com sucesso.', data: address };
    }

    // Atualizar endereço
    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar um endereço do vendedor' })
    @ApiOkResponse({
        description: 'Endereço atualizado com sucesso.',
        type: ApiResponseComposition<AddressEntity>({
            type: 'address',
            nameForSwagger: 'SellerAddressUpdateSuccessResponse',
            message: 'Endereço atualizado com sucesso.',
            statusCode: 200,
        }),
    })
    @ApiBadRequestResponse({ description: 'O ID deve ser um UUIDv7 válido.' })
    @ApiNotFoundResponse({ description: 'Endereço não encontrado.' })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao atualizar o endereço.',
    })
    async updateAddress(
        @Body() updateAddressDto: UpdateAddressDto,
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
        const address = await this.addressService.update(
            updateAddressDto,
            id,
            sellerId,
            'seller'
        );
        return { message: 'Endereço atualizado com sucesso.', data: address };
    }

    // Deletar endereço
    @Delete(':id')
    @ApiOperation({ summary: 'Deletar um endereço do vendedor' })
    @ApiOkResponse({
        description: 'Endereço removido com sucesso.',
        type: ApiResponseComposition<AddressEntity>({
            type: 'address',
            nameForSwagger: 'SellerAddressDeleteSuccessResponse',
            message: 'Endereço delatado com sucesso.',
            statusCode: 200,
        }),
    })
    @ApiBadRequestResponse({ description: 'O ID deve ser um UUIDv7 válido.' })
    @ApiNotFoundResponse({ description: 'Endereço não encontrado.' })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao remover o endereço.',
    })
    async deleteAddress(
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
        const address = await this.addressService.delete(
            id,
            sellerId,
            'seller'
        );
        return { message: 'Endereço deletado com sucesso.', data: address };
    }
}
