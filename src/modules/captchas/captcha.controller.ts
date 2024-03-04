import { NoAuth } from '@/global/decorator';
import {
  getCaptchaReqDto,
  getEmailCaptchaReqDto,
  getPhoneCaptchaReqDto,
} from '@/modules/captchas/dtos/captcha.req.dto';
import {
  getCaptchaResDto,
  getEmailCaptchaResDto,
  getPhoneCaptchaResDto,
} from '@/modules/captchas/dtos/captcha.res.dto';
import EmailInstance from '@/utils/email.utils';
import { createValidCode } from '@/utils/handlePassword';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Session,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as svgCaptcha from 'svg-captcha';
import type { IResData } from '../index';

@ApiTags('验证码')
@Controller('captcha')
@NoAuth()
export class CaptchaController {
  constructor() {}
  @ApiOperation({ summary: '获取图形验证码' })
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
    type: getCaptchaResDto,
  })
  @Get()
  async getCaptcha(
    @Session() session: Record<string, any>,
    @Query() query: getCaptchaReqDto,
  ): Promise<IResData<string>> {
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 2,
      ...query,
    });
    session.captcha = captcha.text;

    return { msg: '获取图形验证码成功', data: captcha.data };
  }

  @ApiOperation({ summary: '获取手机验证码' })
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
    type: getPhoneCaptchaResDto,
  })
  @Get('phone')
  async getPhoneCaptcha(
    @Query() query: getPhoneCaptchaReqDto,
    @Session() session: Record<string, any>,
  ): Promise<IResData<number>> {
    const phoneRex = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    const { phoneNum } = query;
    console.log(phoneNum);
    if (!phoneNum || !phoneRex.test(phoneNum)) {
      throw new HttpException('手机号不正确', HttpStatus.FORBIDDEN);
    }
    const code = createValidCode();
    console.log('手机号码', phoneNum, code);
    session.phoneCaptcha = code;
    return { msg: '获取手机验证码成功' };
  }

  @ApiOperation({ summary: '获取邮箱验证码' })
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
    type: getEmailCaptchaResDto,
  })
  @Get('email')
  async getEmailCaptcha(
    @Query() query: getEmailCaptchaReqDto,
    @Session() session: { emailCaptchaServer: number | undefined },
  ): Promise<IResData<number>> {
    const emailRex = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    const { emailNum } = query;
    if (!emailNum || !emailRex.test(emailNum)) {
      throw new HttpException('邮箱不正确', HttpStatus.FORBIDDEN);
    }
    const code = createValidCode();
    session.emailCaptchaServer = code;
    EmailInstance.send({
      email: emailNum,
      text: `【tutu】您正在注册/登录tutuの网站,验证码为${code}`,
    });
    return { msg: '获取邮箱验证码成功' };
  }
}
