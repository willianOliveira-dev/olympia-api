import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class ProductFilterLimitDto {
    @ApiPropertyOptional({
        description: 'Parâmetro de Rota limit',
        example: 10,
        minLength: 0,
        maxLength: 60,
    })
    @IsOptional()
    @Max(60, { message: ' O limit deve ser menor ou igual 60.' })
    @Min(0, { message: 'O limit deve deve ser um valor positivo.' })
    @IsInt({ message: 'O limit deve ser um valor inteiro.' })
    @Type(() => Number)
    limit?: number;
}
