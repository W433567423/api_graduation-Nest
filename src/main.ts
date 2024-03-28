import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { swaggerOptions, swaggerPrefix } from '@/config/swagger.config';
import { corsConfig } from './config/cors.config';
import { SERVER_PORT, sessionConfig } from './config/root.config';

import { init } from '@/scripts/beforeNest';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  init();
  const app = await NestFactory.create(AppModule, { logger: false });

  // cors
  app.enableCors(corsConfig);

  // swagger
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(swaggerPrefix, app, document);

  // validation
  app.useGlobalPipes(new ValidationPipe());

  // session
  app.use(sessionConfig);

  // websocket
  // app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(SERVER_PORT);
}

bootstrap().then(async () => {
  console.log(`Server is running on http://localhost:${SERVER_PORT}/api`);
});
