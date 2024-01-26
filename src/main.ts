import { NestFactory } from '@nestjs/core';
import { SERVER_PORT } from './config';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // swagger
  const options = new DocumentBuilder()
    .setTitle('Graduation example')
    .setDescription('The API description for tutu の graduation')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);

  await app.listen(SERVER_PORT);
}

bootstrap().then();
