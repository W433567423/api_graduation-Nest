import {
  type CanActivate,
  type ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { IS_PUBLIC } from '../decorator';
import { Reflector } from '@nestjs/core';
import { publicSecret } from '@/config/jwt.config';

// 登录拦截
@Injectable()
export class AuthGuard implements CanActivate {
  // 跳过鉴权(也可用@Public)
  // private readonly urlList: string[] = [
  //   '/user/registry'
  // ]

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      console.log('跳过鉴权');
      return true;
    } else {
      console.log('进入鉴权');
      const request = context.switchToHttp().getRequest();
      const token: string | undefined = context
        .switchToRpc()
        .getData()
        .headers.token?.replaceAll(' ', '');
      // if (this.urlList.includes(request.url)) {
      //   return true
      // }
      if (token) {
        try {
          console.log(
            '鉴权成功',
            verify(token, publicSecret, { algorithms: ['RS256'] }),
          );
          request.user = verify(token, publicSecret, { algorithms: ['RS256'] });
          return true;
        } catch {
          console.log('鉴权失败', token);
          throw new HttpException('token验证失败', HttpStatus.UNAUTHORIZED);
        }
      } else {
        console.log('无token');
        throw new HttpException(
          '没有授权访问,请先登录',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
}
