import { ApiProperty } from '@nestjs/swagger';
import { responseExamples } from './response-examples';

type ExampleTypes = keyof typeof responseExamples;

interface ApiResponseCompositionOptions {
    type: ExampleTypes;
    nameForSwagger: string;
    message: string;
    statusCode: number;
    isArray?: boolean;
}

export function ApiResponseComposition<T>({
    type,
    nameForSwagger,
    message,
    statusCode,
    isArray = false,
}: ApiResponseCompositionOptions) {
    const example = isArray ? [responseExamples[type]] : responseExamples[type];

    class ApiResponseExample {
        @ApiProperty({ example: true })
        success: boolean;

        @ApiProperty({ example: statusCode })
        statusCode: number;

        @ApiProperty({ example: message })
        message: string;

        @ApiProperty({ example: '2025-11-04T12:00:00.000Z' })
        timestamp: string;

        @ApiProperty({
            example: { [type]: example },
            required: false,
        })
        data?: T;
    }

    Object.defineProperty(ApiResponseExample, 'name', {
        value: nameForSwagger,
    });
    
    return ApiResponseExample;
}
