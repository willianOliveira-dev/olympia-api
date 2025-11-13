import { Type } from 'class-transformer';
import { IsOptional, IsInt, Length, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
    @ApiPropertyOptional({
        description: 'Parâmetro de Rota limit',
        example: 20,
        minLength: 0,
        maxLength: 60,
    })
    @IsOptional()
    @Max(60, { message: ' O limit deve ser menor ou igual 60.' })
    @Min(0, { message: 'O limit deve deve ser um valor positivo.' })
    @IsInt({ message: 'O limit deve ser um valor inteiro.' })
    @Type(() => Number)
    limit?: number;
    @ApiPropertyOptional({
        description: 'Parâmetro de Rota offset',
        example: 0,
        minLength: 0,
    })
    @IsOptional()
    @IsInt({ message: 'O offset deve ser um valor inteiro.' })
    @Min(0, { message: 'O offset deve ser um valor positivo.' })
    @Type(() => Number)
    offset?: number;
}
