import {
    IsString,
    IsEmail,
    IsNotEmpty,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    // username
    @ApiProperty({
        example: 'willian123',
        description: 'Nome de usuário (único)',
    })
    @IsString({ message: 'O nome de usuário deve ser um texto' })
    @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
    @MinLength(3, {
        message: 'O nome de usuário deve ter pelo menos 3 caracteres',
    })
    @MaxLength(20, {
        message: 'O nome de usuário deve ter no máximo 20 caracteres',
    })
    username: string;

    // e-mail
    @ApiProperty({
        example: 'willian@example.com',
        description: 'Endereço de e-mail do usuário (deve ser único)',
    })
    @IsEmail({}, { message: 'O e-mail informado é inválido' })
    @IsString({ message: 'O e-mail deve ser um texto' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório' })
    email: string;

    // password
    @ApiProperty({
        example: 'MinhaSenhaForte@123',
        description:
            'Senha do usuário — deve conter letras maiúsculas, minúsculas, números e símbolos',
    })
    @IsString({ message: 'A senha deve ser um texto' })
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
    @MaxLength(64, { message: 'A senha deve ter no máximo 64 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,#^()\-_=+]).+$/, {
        message:
            'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
    })
    password: string;
}
