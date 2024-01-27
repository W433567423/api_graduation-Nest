import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';

import { MySQLConfig, winstonConfig } from '@/config';
import { LoggerMiddleware } from '@/global/middleware';
import { UnifyExceptionFilter } from '@/global/filter';
import { UnifyResponseInterceptor } from '@/global/interceptor';

import { UsersController } from '@/modules/users/users.controller';
import { UsersModule } from '@/modules/users/users.module';
import { CaptchaController } from '@/modules/captcha/captcha.controller';
import { CaptchaService } from '@/modules/captcha/captcha.service';
import { CaptchaModule } from '@/modules/captcha/captcha.module';
import { UsersService } from '@/modules/users/users.service';

@Module({
  imports: [
    winstonConfig,
    TypeOrmModule.forRoot(MySQLConfig),
    UsersModule,
    CaptchaModule,
  ],
  controllers: [AppController, UsersController, CaptchaController],
  providers: [
    // 全局过滤器
    {
      provide: APP_FILTER, // 在这里注册
      useClass: UnifyExceptionFilter,
    },
    // 应用拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: UnifyResponseInterceptor,
    },
    UsersService,
    CaptchaService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
