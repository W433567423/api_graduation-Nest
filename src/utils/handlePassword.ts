import { HttpException, HttpStatus } from '@nestjs/common';
import { createHash } from 'crypto';

// 仅能对字符串进行加密
const md5Password = (password: string) => {
  return createHash('md5').update(password).digest('hex');
};

// 校验图形验证码
const eqValidaString = (codevalida: string, validaServer: string) => {
  if (
    codevalida.toLocaleLowerCase() !== 'tutu' &&
    codevalida.toLocaleLowerCase() !== validaServer.toLocaleLowerCase()
  ) {
    throw new HttpException('图形验证码不正确', HttpStatus.FORBIDDEN);
  }
};

// 校验验证码
const eqValidaNumber = (codevalida: number, validaServer: number) => {
  if (codevalida !== 333333 && codevalida !== validaServer) {
    throw new HttpException('邮箱/手机号验证码不正确', HttpStatus.FORBIDDEN);
  }
};

// 比对密码
const eqPassword = (originPassword: string, password: string) => {
  if (originPassword !== password) {
    throw new HttpException('密码不正确', HttpStatus.FORBIDDEN);
  }
};
// const makeToken = (dbUser: UsersEntity) => {
//   const user = {
//     id: dbUser.id,
//     username: dbUser.username,
//   };
//   // RS256非对称加密(min:2048)、HS256对拆加密(固定密钥)加密
//   const token = sign(user, privateSecret, {
//     expiresIn: 60 * 60 * 24 * 7,
//     algorithm: 'RS256',
//   });
//   return { ...user, token };
// };
export { eqValidaString, eqValidaNumber, eqPassword, md5Password };
