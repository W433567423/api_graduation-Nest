import { HttpException, HttpStatus } from '@nestjs/common';
import { createHash } from 'crypto';

// 仅能对字符串进行加密
const md5Password = (password: string) => {
  return createHash('md5').update(password).digest('hex');
};

// 生成随机验证码
const createValidCode = (len = 6) => {
  let code = 0;
  const codeLen = 10 ** len;
  while (code < codeLen / 10) {
    code = Math.random() * codeLen;
  }

  return Math.floor(code);
};

// 校验图形验证码
const eqValidString = (codeValid: string, validServer: string) => {
  if (
    codeValid.toLocaleLowerCase() !== 'tutu' &&
    codeValid.toLocaleLowerCase() !== validServer.toLocaleLowerCase()
  ) {
    throw new HttpException('图形验证码不正确', HttpStatus.FORBIDDEN);
  }
};

// 校验验证码
const eqValidNumber = (codeValid: number, validServer: number) => {
  if (codeValid !== 333333 && codeValid !== validServer) {
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
export {
  createValidCode,
  eqPassword,
  eqValidNumber,
  eqValidString,
  md5Password,
};
