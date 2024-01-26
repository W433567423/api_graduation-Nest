import { MySQLConfig } from './secret';
import { swaggerOptions, swaggerPrefix } from './swagger';
import { statusFive, statusFour } from './status';
import { winstonConfig } from './winston';

export const SERVER_PORT = 8001;

export {
  MySQLConfig, // mysql 配置
  swaggerOptions, // swagger 配置
  swaggerPrefix, // swagger 前缀
  statusFour, // 响应状态4XX
  statusFive, // 响应状态5XX
  winstonConfig, // 日志系统
};
