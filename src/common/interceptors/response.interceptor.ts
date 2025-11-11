import {
    CallHandler,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import type { Request, Response } from 'express';

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ): Observable<ApiResponse<T>> {
        const ctx = context.switchToHttp();
        const { url } = ctx.getRequest<Request>();
        const { statusCode } = ctx.getResponse<Response>();
        // Aqui o 'next.handle()' executa o controller e devolve o valor retornado.
        return next.handle().pipe(
            map((data) => {
                if (!data || typeof data !== 'object' || !('message' in data)) {
                    throw new HttpException(
                        'Controller deve retornar um objeto no formato { message, data }',
                        HttpStatus.BAD_REQUEST
                    );
                }
                return {
                    statusCode,
                    success: true,
                    message: data.message ?? 'Operação realizada com sucesso.',
                    data: data.data ?? null,
                    timestamp: new Date().toISOString(),
                    path: url,
                };
            })
        );
    }
}
