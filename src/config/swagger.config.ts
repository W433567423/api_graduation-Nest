import { DocumentBuilder } from '@nestjs/swagger';

// swagger配置
const swaggerOptions = new DocumentBuilder()
  .setTitle('毕设swagger')
  .setDescription('The API description for tutu の graduation')
  .setVersion('1.0')
  .build();

// swagger链接前缀
const swaggerPrefix = 'api';
export { swaggerOptions, swaggerPrefix };
