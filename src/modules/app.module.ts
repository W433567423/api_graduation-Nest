import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';

import { MySQLConfig } from '@/config/secret.config';
import { winstonConfig } from '@/config/winston.config';
import UnifyExceptionFilter from '@/global/filter/uinify-exception.filter';
import { AuthGuard } from '@/global/guard/auth.guard';
import UnifyResponseInterceptor from '@/global/interceptor/unify-response.interceptor';
import LoggerMiddleware from '@/global/middleware/logger.middleware';

import { CaptchaController } from '@/modules/captchas/captcha.controller';
import { CaptchaModule } from '@/modules/captchas/captcha.module';
import { UserController } from '@/modules/users/user.controller';
import { UserModule } from '@/modules/users/user.module';
import { UserService } from '@/modules/users/user.service';
import { FileController } from './file/file.controller';
import { FileModule } from './file/file.module';
import { ProjectController } from './projects/project.controller';
import { ProjectModule } from './projects/project.module';
import { ProjectService } from './projects/project.service';

@Module({
  imports: [
    winstonConfig,
    TypeOrmModule.forRoot(MySQLConfig),
    UserModule,
    CaptchaModule,
    ProjectModule,
    FileModule,
  ],
  controllers: [
    AppController,
    UserController,
    CaptchaController,
    ProjectController,
    FileController,
  ],
  providers: [
    UserService,
    ProjectService,
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
