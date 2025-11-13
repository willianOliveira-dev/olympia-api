import { PaginationDto } from './pagination.dto';
import {
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ProductFilterDto extends PaginationDto {
    @ApiPropertyOptional({
        description: 'Parâmetro de Rota search',
        example: 'smartphone galaxy',
    })
    @IsOptional()
    @IsString({ message: 'O valor de busca deve ser um texto.' })
    q?: string;
    @ApiPropertyOptional({
        description: 'Parâmetro de Rota por categoria',
        example: '018e8c4e-9b2a-7d3c-bc3e-9f3f4e2c1a5c',
    })
    @IsOptional()
    @IsUUID('7', { message: "'O ID da categoria precisa ser um UUIDv7 válido" })
    categoryId?: string;
    @ApiPropertyOptional({
        description: 'Parâmetro de Rota por menor preço',
        example: 0,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({
        message: 'O preço mínimo do produto em centavos (ex: 19999 = R$199,99)',
    })
    minPrice?: number;
    @ApiPropertyOptional({
        description: 'Parâmetro de Rota por maior preço',
        example: 19999,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({
        message: 'O preço máximo do produto em centavos (ex: 19999 = R$199,99)',
    })
    maxPrice?: number;

    @ApiPropertyOptional({
        description:
            'Parâmetro de ordenação: ascendente ou descendente apenas quando orderBy for "price".',
        enum: ['asc', 'desc'],
        examples: ['asc', 'desc'],
    })
    @IsOptional()
    @IsString({ message: 'O parâmetro de rota order deve ser um texto.' })
    @ValidateIf((o) => o.orderBy === 'price')
    @IsIn(['asc', 'desc'], {
        message:
            'O parâmetro order deve ser "asc" ou "desc" quando orderBy for "price"',
    })
    order?: string;
    @ApiPropertyOptional({
        description: 'Campo pelo qual será feito a ordenação.',
        enum: ['price', 'createdAt'],
        examples: ['price', 'createdAt'],
    })
    @IsOptional()
    @IsIn(['price', 'createdAt'], {
        message: 'Apenas devem ser passados os valores price ou createdAt.',
    })
    @IsString({ message: 'O parâmetro de rota orderBy deve ser um texto.' })
    orderBy?: string;
}
