import { DocumentBuilder } from '@nestjs/swagger';

const swaggerOptions = new DocumentBuilder()
  .setTitle('Graduation example')
  .setDescription('The API description for tutu の graduation')
  .setVersion('1.0')
  .addTag('users')
  .build();
export { swaggerOptions };
