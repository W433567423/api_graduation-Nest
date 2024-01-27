import { Controller, Get, Response } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as svgCaptcha from 'svg-captcha';

@ApiTags('验证码')
@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}
  @ApiOperation({ summary: '获取验证码' })
  @Get()
  async getCaptcha(@Response() res: any) {
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 2,
    });
    console.log(captcha.text);
    res.type('svg');
    res.send(captcha.data);
  }
}
