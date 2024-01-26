import { NestFactory } from '@nestjs/core';
import { SERVER_PORT } from './config';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions, swaggerPrefix } from '@/config/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  // swagger
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(swaggerPrefix, app, document);
  await app.listen(SERVER_PORT);
  logger.warn(`后台系统已开启，运行在localhost:${SERVER_PORT}`);
}

bootstrap().then();
