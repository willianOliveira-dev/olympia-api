import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsInt,
    Min,
    Length,
    IsArray,
    ArrayMinSize,
    IsUUID,
    IsBoolean,
    IsOptional,
    IsNumber,
    IsDecimal,
    IsDate,
    IsIn,
} from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        description: 'Nome do produto',
        example: 'Smartphone Galaxy S25',
        minLength: 3,
        maxLength: 100,
    })
    @IsString({ message: 'O nome do produto deve ser um texto' })
    @IsNotEmpty({ message: 'O nome do produto é obrigatório' })
    @Length(3, 100, {
        message: 'O nome do produto deve ter entre 2 e 100 caracteres',
    })
    name: string;

    @ApiProperty({
        description: 'Marca do produto',
        example: 'Samsung',
        minLength: 3,
        maxLength: 30,
    })
    @IsString({ message: 'A marca do produto deve ser um texto' })
    @IsNotEmpty({ message: 'A marca do produto é obrigatória' })
    brand: string;

    @ApiProperty({
        description: 'Descrição detalhada do produto',
        example:
            'Smartphone com tela AMOLED de 6.8", 256GB de armazenamento e câmera tripla.',
        minLength: 20,
        maxLength: 600,
    })
    @IsString({ message: 'A descrição do produto deve ser um texto' })
    @IsNotEmpty({ message: 'A descrição do produto é obrigatória' })
    @Length(30, 600, {
        message: 'A descrição deve ter entre 30 e 600 caracteres',
    })
    description: string;

    @ApiProperty({
        description: 'Preço do produto em centavos (ex: 19999 = R$199,99)',
        example: 499900,
    })
    @IsNotEmpty({ message: 'O preço do produto é obrigatório' })
    @IsInt({ message: 'O preço deve ser um número inteiro' })
    @Min(1, { message: 'O preço deve ser maior do que zero' })
    @Type(() => Number)
    price: number;

    @ApiProperty({
        description: 'A quantidade de estoque do produto',
        example: 50,
    })
    @IsInt({ message: 'A quantidade deve ser um número inteiro' })
    @IsNotEmpty({ message: 'A quantidade do produto é obrigatório' })
    @Min(0, { message: 'A quantidade deve ser um valor positivo' })
    quantity: number;

    @ApiProperty({
        description: 'Informa se o produto está em destaque.',
        example: true,
    })
    @IsBoolean({
        message: 'O destaque deve ser um valor booleano (true ou false)',
    })
    @Type(() => Boolean)
    isFeatured: boolean;

    @ApiPropertyOptional({
        description: 'Porcentagem de desconto',
        example: 15,
    })
    @IsOptional()
    @IsOptional()
    @IsInt({ message: 'A porcentagem deve ser um número inteiro' })
    @Type(() => Number)
    discountPercentage: number;
    
    @ApiPropertyOptional({
        description: 'Data de término do desconto.',
        example: '2025-01-01T00:00:00.000Z',
    })
    @IsOptional()
    @IsDate({ message: 'A data de término de desconto deve ser um Date' })
    @Type(() => Date)
    discountEndDate: Date;

    @ApiProperty({
        example: [
            '018e8c4e-9b2a-7d3c-bc3e-9f3f4e2c1a5c',
            '018e8c4e-9b2a-7d3c-bc3e-9f3f4e2c1a60',
        ],
        isArray: true,
        description: 'Lista de IDs de categorias (opcional)',
        minItems: 1,
    })
    @IsArray({ message: 'As categorias devem estar em um array' })
    @ArrayMinSize(1, { message: 'Pelo menos uma categoria é obrigatória' })
    @IsUUID('7', {
        each: true,
        message: 'Cada categoryId deve ser um UUIDv7 válido',
    })
    categories: string[];
}
