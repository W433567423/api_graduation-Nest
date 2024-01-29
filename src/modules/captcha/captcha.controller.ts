import { Controller, Get, Query, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { CaptchaService } from './captcha.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as svgCaptcha from 'svg-captcha';
import { NoAuth } from '@/global/decorator';
import { getCaptchaDto } from '@/modules/captcha/dto/captcha.dto';

@ApiTags('验证码')
@Controller('captcha')
@NoAuth()
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}
  @ApiOperation({ summary: '获取验证码' })
  @Get()
  async getCaptcha(
    @Res() res: Response,
    @Session() session: Record<string, any>,
    @Query() query: getCaptchaDto,
  ) {
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 2,
      ...query,
    });
    session.captcha = captcha.text;
    console.log(captcha.text);
    res.type('svg');
    res.send(captcha.data);
  }
}
