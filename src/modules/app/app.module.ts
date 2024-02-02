import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';

import { MySQLConfig, winstonConfig } from '@/config';
import { LoggerMiddleware } from '@/global/middleware';
import { UnifyExceptionFilter } from '@/global/filter';
import { UnifyResponseInterceptor } from '@/global/interceptor';
import { AuthGuard } from '@/global/guard/auth.guard';

import { UsersController } from '@/modules/users/users.controller';
import { UsersModule } from '@/modules/users/users.module';
import { CaptchaController } from '@/modules/captcha/captcha.controller';
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
    UsersService,
    // 鉴权守卫
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // 全局异常过滤器
    {
      provide: APP_FILTER, // 在这里注册
      useClass: UnifyExceptionFilter,
    },
    // 应用响应拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: UnifyResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
