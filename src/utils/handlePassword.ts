import { createHash } from 'crypto';
import { HttpException, HttpStatus } from '@nestjs/common';

const md5Password = (password: string) => {
  // 仅能对字符串进行加密
  return createHash('md5').update(password).digest('hex');
};

const eqValida = (valida: string, validaServer: string) => {
  // 校验验证码
  if (
    valida.toLocaleLowerCase() !== 'tutu' &&
    valida.toLocaleLowerCase() !== validaServer.toLocaleLowerCase()
  ) {
    throw new HttpException('验证码不正确', HttpStatus.FORBIDDEN);
  }
};
export { md5Password, eqValida };
