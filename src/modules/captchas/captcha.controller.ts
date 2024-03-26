import { NoAuth } from '@/global/decorator';
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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as svgCaptcha from 'svg-captcha';
import type { IResData } from '../index';

@ApiTags('验证码')
@NoAuth()
@Controller('captcha')
export class CaptchaController {
  constructor() {}
  @ApiOperation({ summary: '获取图形验证码' })
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
    type: getCaptchaResDto,
  })
  @ApiQuery({
    name: 'width',
    description: 'svg的长度(px)',
    type: Number,
    required: false,
    example: 200,
  })
  @ApiQuery({
    name: 'height',
    description: 'svg的宽度(px)',
    type: Number,
    required: false,
    example: 200,
  })
  @Get()
  async getCaptcha(
    @Session() session: { captcha: string },
    @Query('width') width: number,
    @Query('height') height: number,
  ): Promise<IResData<string>> {
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 2,
      width,
      height,
    });
    session.captcha = captcha.text;

    return { msg: '获取图形验证码成功', data: captcha.data };
  }

  // TODO 未实现
  @ApiOperation({ summary: '获取手机验证码' })
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
    type: getPhoneCaptchaResDto,
  })
  @ApiQuery({
    name: 'phoneNum',
    required: true,
    example: '17762647331',
    type: String,
  })
  @Get('phone')
  async getPhoneCaptcha(
    @Query('phoneNum') phoneNum: string,
    @Session() session: Record<string, any>,
  ): Promise<IResData<number>> {
    const phoneRex = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!phoneNum || !phoneRex.test(phoneNum)) {
      throw new HttpException('手机号不正确', HttpStatus.FORBIDDEN);
    }
    const code = createValidCode();
    session.phoneCaptcha = code;
    return { msg: '获取手机验证码成功' };
  }

  @ApiOperation({ summary: '获取邮箱验证码' })
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
    type: getEmailCaptchaResDto,
  })
  @ApiQuery({
    name: 'emailNum',
    required: true,
    example: 't433567423@163.com',
    type: String,
  })
  @Get('email')
  async getEmailCaptcha(
    @Query('emailNum') emailNum: string,
    @Session() session: { emailCaptchaServer: number | undefined },
  ): Promise<IResData<number>> {
    const emailRex = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
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
