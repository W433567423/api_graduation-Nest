import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { map, Observable } from 'rxjs';
import { Logger } from 'winston';
import { getInfoReq } from 'src/global/helper/getInfoReq';
import type { IResData } from '@/modules';

@Injectable()
export default class TransformInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: IResData<any>) => {
        this.logger.info('response', {
          responseData: data,
          req: getInfoReq(context.switchToHttp().getRequest()),
        });
        return {
          code: data.code || 200,
          message: data.msg || '请求成功',
          data: data.data,
        };
      }),
    );
  }
}
