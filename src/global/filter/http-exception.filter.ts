// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
//   Inject,
// } from '@nestjs/common';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { Logger } from 'winston';
// import { getInfoReq } from '@/global/helper';
//
// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   constructor(
//     @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
//   ) {}
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   catch(exception: HttpException, host: ArgumentsHost) {
//     // ...
//
//     this.logger.error(message, {
//       status,
//       req: getInfoReq(ctx.getRequest()),
//     });
//   }
// }
