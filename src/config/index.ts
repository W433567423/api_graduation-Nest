import { MySQLConfig } from './secret.config';
import { swaggerOptions, swaggerPrefix } from './swagger.config';
import { statusFive, statusFour } from './status.config';
import { winstonConfig } from './winston.config';
import { sessionConfig } from './session.config';
import { jwtConfig, jwtSecret } from './jwt.config';

export const SERVER_PORT = 8004;

export {
  MySQLConfig, // mysql 配置
  swaggerOptions, // swagger 配置
  swaggerPrefix, // swagger 前缀
  statusFour, // 响应状态4XX
  statusFive, // 响应状态5XX
  winstonConfig, // 日志系统
  sessionConfig,
  jwtConfig,
  jwtSecret,
};
