import {
    IsString,
    IsOptional,
    IsEmail,
    MaxLength,
    MinLength,
    Matches,
    IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSellerDto {
    @ApiProperty({
        example: 'Loja do Willian',
        description: 'Nome público da loja',
    })
    @IsString({ message: 'O nome da loja deve ser uma string.' })
    @IsNotEmpty({ message: 'O nome da loja é obrigatório.' })
    @MinLength(3, {
        message: 'O nome da loja deve ter pelo menos 3 caracteres.',
    })
    @MaxLength(100, {
        message: 'O nome da loja deve ter no máximo 100 caracteres.',
    })
    storeName: string;

    @ApiProperty({
        example: '12.345.678/0001-00',
        description: 'Cadastro Nacional da Pessoa Jurídica (CNPJ)',
    })
    @IsString({ message: 'O CNPJ deve ser uma string.' })
    @IsNotEmpty({ message: 'O CNPJ é obrigatório.' })
    @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$|^\d{14}$/, {
        message:
            'CNPJ inválido. Use o formato 00000000000000 ou 00.000.000/0000-00.',
    })
    cnpj: string;

    @ApiProperty({
        example: 'Empresa LTDA',
        description: 'Razão social da empresa',
    })
    @IsString({ message: 'A razão social deve ser uma string.' })
    @IsNotEmpty({ message: 'A razão social é obrigatória.' })
    @MinLength(3, {
        message: 'A razão social deve ter pelo menos 3 caracteres.',
    })
    @MaxLength(150, {
        message: 'A razão social deve ter no máximo 150 caracteres.',
    })
    companyName: string;

    @ApiProperty({
        example: 'MEI',
        description: 'Regime tributário da empresa',
    })
    @IsString({ message: 'O regime tributário deve ser uma string.' })
    @IsNotEmpty({ message: 'O regime tributário é obrigatório.' })
    @MinLength(3, {
        message: 'O regime tributário deve ter pelo menos 3 caracteres.',
    })
    @MaxLength(50, {
        message: 'O regime tributário deve ter no máximo 50 caracteres.',
    })
    taxRegime: string;

    @ApiProperty({
        example: '123456789',
        description: 'Inscrição estadual da empresa',
    })
    @IsString({ message: 'A inscrição estadual deve ser uma string.' })
    @IsNotEmpty({ message: 'A inscrição estadual é obrigatória.' })
    @MaxLength(50, {
        message: 'A inscrição estadual deve ter no máximo 50 caracteres.',
    })
    stateRegistration: string;

    @ApiProperty({
        example: '987654321',
        description: 'Inscrição municipal da empresa (opcional)',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'A inscrição municipal deve ser uma string.' })
    @MaxLength(50, {
        message: 'A inscrição municipal deve ter no máximo 50 caracteres.',
    })
    municipalRegistration?: string | null;

    @ApiProperty({
        example: 'contato@lojawillian.com',
        description: 'E-mail comercial da empresa (opcional)',
        required: false,
    })
    @IsOptional()
    @IsEmail({}, { message: 'O e-mail comercial é inválido.' })
    businessEmail?: string | null;

    @ApiProperty({
        example: '+55 11 99999-9999',
        description: 'Telefone de contato da empresa (opcional)',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'O telefone deve ser uma string.' })
    @MaxLength(30, { message: 'O telefone deve ter no máximo 30 caracteres.' })
    phoneNumber?: string | null;

    @ApiProperty({
        example: 'https://lojawillian.com',
        description: 'Site da loja (opcional)',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'O site deve ser uma string.' })
    @MaxLength(255, { message: 'O site deve ter no máximo 255 caracteres.' })
    website?: string | null;
}
