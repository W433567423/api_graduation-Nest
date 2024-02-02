import {
  eqPassword,
  eqValidaString,
  eqValidaNumber,
  md5Password,
} from './handlePassword';
import EmailInstance from './email.utils';
// 生成随机验证码
const creatValidaCode = (len = 6) => {
  let code = 0;
  const codeLen = 10 ** len;
  while (code < codeLen / 10) {
    code = Math.random() * codeLen;
  }

  return Math.floor(code);
};
export {
  md5Password,
  eqPassword,
  eqValidaString,
  eqValidaNumber,
  creatValidaCode,
  EmailInstance,
};
