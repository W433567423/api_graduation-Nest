import { DocumentBuilder } from '@nestjs/swagger';
// swagger配置
const swaggerOptions = new DocumentBuilder()
  .setTitle('毕设swagger')
  .setDescription('The API description for tutu の graduation')
  .setVersion('1.0')
  .setContact('tutu', 'https://wtututu.top', 't433567423@163.com')
  .addBearerAuth(
    {
      type: 'apiKey',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'token验证身份(基于JWT)',
    },
    'JWT-auth',
  )
  .addApiKey()
  .build();

// swagger链接前缀
const swaggerPrefix = 'api';
export { swaggerOptions, swaggerPrefix };
