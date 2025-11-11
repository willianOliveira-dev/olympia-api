import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('olympia/api/v1');
    app.useGlobalFilters(
        new PrismaClientExceptionFilter(),
        new HttpExceptionFilter()
    );
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        })
    );

    const config = new DocumentBuilder()
        .setTitle('Olympia e-commerce API')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    app.use(
        '/docs',
        apiReference({
            content: document,
            theme: 'deepSpace',
        })
    );

    await app.listen(env.PORT);
    console.log(
        `🔥 API rodando em http://localhost:${env.PORT}/olympia/api/v1`
    );
    console.log(`📘 Documentação em http://localhost:${env.PORT}/docs`);
}
bootstrap();
