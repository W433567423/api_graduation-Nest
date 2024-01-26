import { NestFactory } from '@nestjs/core';
import { SERVER_PORT } from './config';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(SERVER_PORT);
}

bootstrap().then();
