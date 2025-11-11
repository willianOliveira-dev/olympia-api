import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import type { Response } from 'express';

type GetResponseException =
    | string
    | { message?: string | string[]; error?: string };

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const { url } = ctx.getRequest<Request>();
        const statusCode = exception.getStatus();
        const res = exception.getResponse() as GetResponseException;
        const message =
            typeof res === 'string'
                ? res
                : Array.isArray(res.message)
                ? res.message.join(', ')
                : res.message || 'Erro inesperado.';

        response.status(statusCode).json({
            statusCode,
            success: false,
            message,
            error: exception.name,
            timeStamp: new Date().toISOString(),
            path: url,
        });
    }
}
