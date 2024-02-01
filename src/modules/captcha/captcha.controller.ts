import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Session,
} from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as svgCaptcha from 'svg-captcha';
import { NoAuth } from '@/global/decorator';
import {
  getCaptchaReqDto,
  getPhoneCaptchaReqDto,
} from '@/modules/captcha/dto/captcha.req.dto';
import { creatValidaCode } from '@/utils';
import {
  getCaptchaResDto,
  getPhoneCaptchaResDto,
} from '@/modules/captcha/dto/captcha.res.dto';

@ApiTags('验证码')
@Controller('captcha')
@NoAuth()
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}
  @ApiOperation({ summary: '获取验证码' })
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
    type: getCaptchaResDto,
  })
  @Get()
  async getCaptcha(
    @Session() session: Record<string, any>,
    @Query() query: getCaptchaReqDto,
  ) {
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 2,
      ...query,
    });
    session.captcha = captcha.text;
    return captcha.data;
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
  ) {
    const phoneRex = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    const { phoneNum } = query;
    console.log(phoneNum);
    if (!phoneNum || phoneNum.length !== 11 || phoneRex.test(phoneNum)) {
      throw new HttpException('手机号不正确', HttpStatus.FORBIDDEN);
    }
    const code = creatValidaCode();
    console.log('手机号码', phoneNum, code);
    session.phoneCaptcha = code;
    return code;
  }
}
