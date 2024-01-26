import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, // ①
  ) {}
  use(req: any, res: any, next: () => void) {
    const { method, originalUrl: url, body, query, params, ip } = req;
    this.logger.warn('route', {
      req: {
        method,
        url,
        body,
        query,
        params,
        ip,
      },
    });
    console.log('route', {
      req: {
        method,
        url,
        body,
        query,
        params,
        ip,
      },
    });
    next();
  }
}
