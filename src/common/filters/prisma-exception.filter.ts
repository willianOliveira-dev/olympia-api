import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
    catch(
        exception: Prisma.PrismaClientKnownRequestError,
        host: ArgumentsHost
    ) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const { url } = ctx.getRequest<Request>();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Erro interno no banco de dados';
        let field: string | null = null;

        // Trata tipos comuns de erros Prisma
        switch (exception.code) {
            case 'P2002':
                // Violação de constraint única (ex: email já existe)
                status = HttpStatus.CONFLICT;
                field = (exception.meta?.target as string[])?.[0];
                message = `O campo '${field}' deve ser único.`;
                break;

            case 'P2025':
                // Registro não encontrado
                status = HttpStatus.NOT_FOUND;
                message = 'Registro não encontrado.';
                break;

            case 'P2003':
                // Violação de chave estrangeira
                status = HttpStatus.BAD_REQUEST;
                field = exception.meta?.field_name as string;
                message = `Não é possível associar — verifique o campo '${field}'.`;
                break;

            case 'P2014':
                // Violação de relação inválida
                status = HttpStatus.BAD_REQUEST;
                message = 'Relacionamento inválido entre entidades.';
                break;

            case 'P2000':
                // Valor de campo muito longo
                status = HttpStatus.BAD_REQUEST;
                field = exception.meta?.column_name as string;
                message = `O valor no campo '${field}' é muito longo.`;
                break;
        }

        response.status(status).json({
            statusCode: status,
            message,
            error: exception.message,
            timestamp: new Date().toISOString(),
            path: url,
        });
    }
}
