import {
    IsString,
    IsNotEmpty,
    IsOptional,
    MaxLength,
    MinLength,
    Matches,
    IsInt,
    IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
    @ApiProperty({
        example: 'Willian Oliveira',
        description:
            'Nome do responsável pelo imóvel (proprietário ou locador)',
    })
    @IsString({ message: 'O nome do locador deve ser uma string' })
    @IsNotEmpty({ message: 'O nome do locador é obrigatório' })
    @MinLength(3, {
        message: 'O nome do locador deve ter pelo menos 3 caracteres',
    })
    @MaxLength(100, {
        message: 'O nome do locador deve ter no máximo 100 caracteres',
    })
    landlord: string;

    @ApiProperty({
        example: '21 99999-9999',
        description: 'Telefone de contato do locador',
    })
    @IsString({ message: 'O telefone deve ser uma string' })
    @IsNotEmpty({ message: 'O telefone é obrigatório' })
    @MaxLength(30, {
        message: 'O telefone deve ter no máximo 30 caracteres',
    })
    phoneNumber:  string;
    @ApiProperty({
        example: 'Casa',
        description: 'Etiqueta do endereço (ex: Casa, Trabalho)',
    })
    @IsString({ message: 'A etiqueta do endereço deve ser uma string' })
    @IsNotEmpty({ message: 'A etiqueta do endereço é obrigatória' })
    @MinLength(3, {
        message: 'A etiqueta do endereço deve ter pelo menos 3 caracteres',
    })
    @MaxLength(50, {
        message: 'A etiqueta do endereço deve ter no máximo 50 caracteres',
    })
    label: string;

    @ApiProperty({
        example: 'Rua das Palmeiras',
        description: 'Nome da rua',
    })
    @IsString({ message: 'O nome da rua deve ser uma string' })
    @IsNotEmpty({ message: 'O nome da rua é obrigatório' })
    @MinLength(3, {
        message: 'O nome da rua deve ter pelo menos 3 caracteres',
    })
    @MaxLength(100, {
        message: 'O nome da rua deve ter no máximo 100 caracteres',
    })
    street: string;

    @ApiProperty({
        example: 123,
        description: 'Número do endereço',
    })
    @IsInt({ message: 'O número deve ser um número inteiro' })
    @IsNotEmpty({ message: 'O número do endereço é obrigatório' })
    number: number;

    @ApiProperty({
        example: 'Apartamento 202',
        description: 'Complemento do endereço (opcional)',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'O complemento deve ser uma string' })
    @MaxLength(100, {
        message: 'O complemento deve ter no máximo 100 caracteres',
    })
    complement?: string | null;

    @ApiProperty({
        example: 'Jardim Primavera',
        description: 'Bairro',
    })
    @IsString({ message: 'O bairro deve ser uma string' })
    @IsNotEmpty({ message: 'O bairro é obrigatório' })
    @MinLength(3, {
        message: 'O bairro deve ter pelo menos 3 caracteres',
    })
    @MaxLength(100, {
        message: 'O bairro deve ter no máximo 100 caracteres',
    })
    neighborhood: string;

    @ApiProperty({
        example: 'Duque de Caxias',
        description: 'Cidade',
    })
    @IsString({ message: 'A cidade deve ser uma string' })
    @IsNotEmpty({ message: 'A cidade é obrigatória' })
    @MinLength(3, {
        message: 'A cidade deve ter pelo menos 3 caracteres',
    })
    @MaxLength(100, {
        message: 'A cidade deve ter no máximo 100 caracteres',
    })
    city: string;

    @ApiProperty({
        example: 'RJ',
        description: 'Estado (sigla)',
    })
    @IsString({ message: 'O estado deve ser uma string' })
    @IsNotEmpty({ message: 'O estado é obrigatório' })
    @MaxLength(2, {
        message: 'O estado deve ter no máximo 2 caracteres (sigla)',
    })
    state: string;

    @ApiProperty({
        example: '25085-000',
        description: 'CEP (Código de Endereçamento Postal)',
    })
    @IsString({ message: 'O CEP deve ser uma string' })
    @IsNotEmpty({ message: 'O CEP é obrigatório' })
    @Matches(/^\d{5}-\d{3}$/, {
        message: 'O CEP deve estar no formato 00000-000',
    })
    zipCode: string;

    @ApiProperty({
        example: true,
        description: 'Define se é o endereço principal',
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'O campo isDefault deve ser um valor booleano' })
    isDefault?: boolean = false;
}
