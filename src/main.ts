import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { SERVER_PORT, sessionConfig, corsConfig } from './config';
import { swaggerOptions, swaggerPrefix } from '@/config/swagger.config';

import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors
  app.enableCors(corsConfig);

  // swagger
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(swaggerPrefix, app, document);

  // validation
  app.useGlobalPipes(new ValidationPipe());

  // session
  app.use(sessionConfig);

  await app.listen(SERVER_PORT);
}

bootstrap().then();
