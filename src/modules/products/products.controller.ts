import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
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
    ApiInternalServerErrorResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from '../../common/dto/product-filter.dto';
import { ProductEntity } from './entities/product.entity';
import { ApiResponseComposition } from '../../helpers/api-response';
import { ProductFilterLimitDto } from 'src/common/dto/productFilterLimit.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

const sellerId = '019a5620-428c-7b28-a5db-9612e5ec52b9';
@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    // Listar produtos com filtros
    @Get()
    @ApiOperation({ summary: 'Listar produtos com filtros' })
    @ApiOkResponse({
        description: 'Produtos listados com sucesso.',
        type: ApiResponseComposition<ProductEntity[]>({
            type: 'productPagination',
            nameForSwagger: 'ProductListSuccessResponse',
            message: 'Produtos encontrados com sucesso.',
            statusCode: 200,
            isArray: true,
        }),
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao buscar os produtos.',
    })
    async findGeneral(@Query() productFilter: ProductFilterDto) {
        const product = await this.productsService.findAll(productFilter);
        return { message: 'Produtos encontrados com sucesso.', data: product };
    }

    // Listar produtos com paginação do vendedor
    @Get('seller')
    @ApiOperation({ summary: 'Listar produtos com paginação do vendedor' })
    @ApiOkResponse({
        description: 'Produtos listados com sucesso.',
        type: ApiResponseComposition<ProductEntity[]>({
            type: 'productPagination',
            nameForSwagger: 'ProductListSuccessResponse',
            message: 'Produtos encontrados com sucesso.',
            statusCode: 200,
            isArray: true,
        }),
    })
    @ApiNotFoundResponse({
        description: 'Vendedor não encontrado.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao buscar os produtos.',
    })
    async fintBySeller(@Query() p: PaginationDto) {
        const product = await this.productsService.findBySeller(sellerId, p);
        return { message: 'Produtos encontrados com sucesso.', data: product };
    }

    // Listar produtos novos
    @Get('new')
    @ApiOperation({ summary: 'Listar produtos recém cadastrados' })
    @ApiOkResponse({
        description: 'Produtos novos listados com sucesso.',
        type: ApiResponseComposition<ProductEntity[]>({
            type: 'product',
            nameForSwagger: 'ProductNewListSuccessResponse',
            message: 'Produtos encontrados com sucesso.',
            statusCode: 200,
            isArray: true,
        }),
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao buscar os produtos.',
    })
    async findNew(@Query() { limit = 10 }: ProductFilterLimitDto) {
        const product = await this.productsService.findNew({ limit });
        return { message: 'Produtos encontrados com sucesso.', data: product };
    }

    // Listar produtos em destaque
    @Get('featured')
    @ApiOperation({ summary: 'Listar produtos em destaque' })
    @ApiOkResponse({
        description: 'Produtos em destaque listados com sucesso.',
        type: ApiResponseComposition<ProductEntity[]>({
            type: 'product',
            nameForSwagger: 'ProductFeaturedListSuccessResponse',
            message: 'Produtos encontrados com sucesso.',
            statusCode: 200,
            isArray: true,
        }),
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao buscar os produtos.',
    })
    async findFeatured(@Query() { limit = 30 }: ProductFilterLimitDto) {
        const product = await this.productsService.findFeatured({ limit });
        return { message: 'Produtos encontrados com sucesso.', data: product };
    }

    // Criar novo produto
    @Post('seller')
    @ApiOperation({ summary: 'Criar um novo produto' })
    @ApiCreatedResponse({
        description: 'Produto criado com sucesso.',
        type: ApiResponseComposition<ProductEntity>({
            type: 'product',
            nameForSwagger: 'ProductCreateSuccessResponse',
            message: 'Produto criado com sucesso.',
            statusCode: 201,
        }),
    })
    @ApiNotFoundResponse({
        description: 'Vendedor não encontrado.',
    })
    @ApiBadRequestResponse({
        description: 'Alguma categoria enviada não existe.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao criar o produto.',
    })
    async createProduct(@Body() createProductDto: CreateProductDto) {
        const product = await this.productsService.create(
            createProductDto,
            sellerId
        );
        return { message: 'Produto criado com sucesso.', data: product };
    }

    // Buscar produto por ID
    @Get(':id')
    @ApiOperation({ summary: 'Buscar um produto por ID' })
    @ApiOkResponse({
        description: 'Produto encontrado com sucesso.',
        type: ApiResponseComposition<ProductEntity>({
            type: 'product',
            nameForSwagger: 'ProductFindOneSuccessResponse',
            message: 'Produto encontrado com sucesso.',
            statusCode: 200,
        }),
    })
    @ApiBadRequestResponse({ description: 'O ID deve ser um UUIDv7 válido.' })
    @ApiNotFoundResponse({ description: 'Produto não encontrado.' })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao buscar o produto.',
    })
    async findOne(
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
        const product = await this.productsService.findOne(id);
        return { message: 'Produto encontrado com sucesso.', data: product };
    }

    // Atualizar produto
    @Patch('edit/:id')
    @ApiOperation({ summary: 'Atualizar um produto existente' })
    @ApiOkResponse({
        description: 'Produto atualizado com sucesso.',
        type: ApiResponseComposition<ProductEntity>({
            type: 'product',
            nameForSwagger: 'ProductUpdateSuccessResponse',
            message: 'Produto atualizado com sucesso.',
            statusCode: 200,
        }),
    })
    @ApiForbiddenResponse({
        description: 'Você não possui autorização para modificar esse produto.',
    })
    @ApiBadRequestResponse({ description: 'O ID deve ser um UUIDv7 válido.' })
    @ApiNotFoundResponse({
        description: 'Produto não encontrado ou Vendedor não encontrado.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao atualizar o produto.',
    })
    async updateProduct(
        @Body() updateProductDto: UpdateProductDto,
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
        const product = await this.productsService.update(
            updateProductDto,
            id,
            sellerId
        );
        return { message: 'Produto atualizado com sucesso.', data: product };
    }

    // Deletar produto
    @Delete('delete/:id')
    @ApiOperation({ summary: 'Deletar um produto' })
    @ApiOkResponse({
        description: 'Produto removido com sucesso.',
        type: ApiResponseComposition<ProductEntity>({
            type: 'product',
            nameForSwagger: 'ProductDeleteSuccessResponse',
            message: 'Produto deletado com sucesso.',
            statusCode: 200,
        }),
    })
    @ApiForbiddenResponse({
        description: 'Você não possui autorização para modificar esse produto.',
    })
    @ApiBadRequestResponse({ description: 'O ID deve ser um UUIDv7 válido.' })
    @ApiNotFoundResponse({
        description: 'Produto não encontrado ou Vendedor não encontrado.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno ao remover o produto.',
    })
    async deleteProduct(
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
        const product = await this.productsService.delete(id, sellerId);
        return { message: 'Produto deletado com sucesso.', data: product };
    }
}
