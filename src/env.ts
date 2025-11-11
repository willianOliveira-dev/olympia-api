import 'dotenv/config';
import {
    IsInt,
    IsNotEmpty,
    IsPositive,
    IsString,
    IsUrl,
} from 'class-validator';

export class env {
    @IsString({ message: 'DATABASE_URL deve ser um string.' })
    @IsNotEmpty({ message: 'DATABASE_URL é obrigatório.' })
    @IsUrl()
    static readonly DATABASE_URL: string = process.env.DATABASE_URL as string;
    @IsInt({ message: 'PORT deve ser um inteiro.' })
    @IsPositive({ message: 'PORT deve ser positivo.' })
    @IsNotEmpty({ message: 'PORT é obrigatório.' })
    static readonly PORT: number = Number(process.env.PORT) || 3000;
}
