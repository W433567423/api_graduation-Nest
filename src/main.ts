import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { SERVER_PORT, sessionConfig } from './config';
import { swaggerOptions, swaggerPrefix } from '@/config/swagger.config';

import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn'],
    cors: true,
  });
  // swagger
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(swaggerPrefix, app, document);

  // validation
  app.useGlobalPipes(new ValidationPipe());

  // session
  app.use(sessionConfig);

  await app.listen(SERVER_PORT);
  logger.warn(`后台系统已开启，运行在localhost:${SERVER_PORT}`);
}

bootstrap().then();
