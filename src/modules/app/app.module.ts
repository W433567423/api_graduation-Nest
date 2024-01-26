import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from '@/modules/users/users.controller';
import { UsersService } from '@/modules/users/users.service';
import { UsersModule } from '@/modules/users/users.module';
import { MySQLConfig, winstonConfig } from '@/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from '@/global/middleware/logger/logger.middleware';

// import { HttpExceptionFilter } from '@/global/filter/http-exception.filter';

@Module({
  imports: [winstonConfig, TypeOrmModule.forRoot(MySQLConfig), UsersModule],
  controllers: [AppController, UsersController],
  providers: [
    // {
    //   provide: APP_FILTER, // 在这里注册
    //   useClass: HttpExceptionFilter,
    // },
    UsersService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
