import {
  type CanActivate,
  type ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IS_PUBLIC } from '../decorator';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '@/config/jwt.config';
import type { IUser, IReqUser } from '@/modules';
// 登录拦截
@Injectable()
export class AuthGuard implements CanActivate {
  // 跳过鉴权(也可用@Public)
  // private readonly urlList: string[] = [
  //   '/user/registry'
  // ]

  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    } else {
      const request = context.switchToHttp().getRequest<IReqUser>();
      const authorization: string | undefined = context
        .switchToRpc()
        .getData()
        .headers?.authorization?.replace('Bearer ', '');
      if (authorization) {
        try {
          request['user'] = await this.jwtService.verifyAsync<IUser>(
            authorization,
            {
              secret: jwtSecret,
            },
          );
          return true;
        } catch {
          throw new UnauthorizedException();
        }
      } else {
        console.log('无token/token失效');
        throw new HttpException(
          '没有授权访问或授权失败,请重新登录',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
}
