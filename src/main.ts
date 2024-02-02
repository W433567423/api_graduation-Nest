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
  });

  // cors
  app.enableCors({
    //  定义了被允许的请求头列表。这里指定了几个常见的请求头（如果请求头里面的自定义字段也要加上去）
    allowedHeaders: [
      'Accept',
      'Accept-Version',
      'Content-Type',
      'Api-Version',
      'Origin',
      'X-Requested-With',
      'Authorization',
    ],
    //定义了允许跨域访问的来源。可以是一个字符串，也可以是一个字符串数组
    origin: ['http://localhost:5173'],
    // 指定了是否允许跨域请求携带认证信息，如 Cookies、Authorization 等
    credentials: true,
    //  定义了响应头中可以被客户端读取的字段列表。这里只列出了一个字段名 API-Token-Expiry。
    exposedHeaders: ['API-Token-Expiry'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
