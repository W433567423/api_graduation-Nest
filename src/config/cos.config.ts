import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
export const corsConfig: CorsOptions = {
  //  定义了被允许的请求头列表。这里指定了几个常见的请求头（如果请求头里面的自定义字段也要加上去）
  allowedHeaders: [
    'Accept',
    'Accept-Version',
    'Content-Type',
    'Api-Version',
    'Origin',
    'X-Requested-With',
    'Authorization',
  ],
  //定义了允许跨域访问的来源。可以是一个字符串，也可以是一个字符串数组
  origin: ['http://localhost:8003', 'https://g.wtututu.top'],
  // 指定了是否允许跨域请求携带认证信息，如 Cookies、Authorization 等
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};
