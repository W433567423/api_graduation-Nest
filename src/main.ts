import { NestFactory } from '@nestjs/core';
import { SERVER_PORT } from './config';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from '@/config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // swagger
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);

  await app.listen(SERVER_PORT);
}

bootstrap().then();
