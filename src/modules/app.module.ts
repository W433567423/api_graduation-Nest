import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';

import { winstonConfig } from '@/config/winston.config';
import { MySQLConfig } from '@/config/secret.config';
import { LoggerMiddleware } from '@/global/middleware';
import { UnifyExceptionFilter } from '@/global/filter';
import { UnifyResponseInterceptor } from '@/global/interceptor';
import { AuthGuard } from '@/global/guard/auth.guard';

import { UsersController } from '@/modules/users/user.controller';
import { UsersModule } from '@/modules/users/user.module';
import { CaptchaController } from '@/modules/captchas/captcha.controller';
import { CaptchaModule } from '@/modules/captchas/captcha.module';
import { UsersService } from '@/modules/users/user.service';
import { ProjectsController } from './projects/project.controller';
import { ProjectsModule } from './projects/project.module';
import { ProjectsService } from './projects/project.service';

@Module({
  imports: [
    winstonConfig,
    TypeOrmModule.forRoot(MySQLConfig),
    UsersModule,
    CaptchaModule,
    ProjectsModule,
  ],
  controllers: [
    AppController,
    UsersController,
    CaptchaController,
    ProjectsController,
  ],
  providers: [
    UsersService,
    ProjectsService,
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
