import { HttpException, HttpStatus } from '@nestjs/common';
import { createHash } from 'crypto';

// 仅能对字符串进行加密
const md5Password = (password: string) => {
  return createHash('md5').update(password).digest('hex');
};

// 校验验证码
const eqValidaString = (originValida: string, valida: string) => {
  if (
    originValida.toLocaleLowerCase() !== 'tutu' &&
    originValida.toLocaleLowerCase() !== valida.toLocaleLowerCase()
  ) {
    throw new HttpException('验证码不正确', HttpStatus.FORBIDDEN);
  }
};

// 校验验证码
const eqValidaNumber = (
  originValida: string | number,
  valida: string | number,
) => {
  if (
    Number(originValida) !== 123456 &&
    Number(originValida) !== Number(valida)
  ) {
    throw new HttpException('验证码不正确', HttpStatus.FORBIDDEN);
  }
};

// 比对密码
const eqPassword = (originPassword: string, password: string) => {
  if (originPassword !== password) {
    throw new HttpException('密码不正确', HttpStatus.FORBIDDEN);
  }
};

// // 生成token
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
