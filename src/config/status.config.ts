import { ApiResponseOptions } from '@nestjs/swagger';

export const statusFour: ApiResponseOptions = {
  status: '4XX',
  description: '权限/接口错误',
};
export const statusFive: ApiResponseOptions = {
  status: '5XX',
  description: '系统内部错误',
};
