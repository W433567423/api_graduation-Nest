import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../users/user.service';

@Injectable()
export class PinanService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}

  // 登录
  async login(loginData: { username: string; password: string; code: number }) {
    const url = 'https://g63a2.danimmp.net/Pay_user/CheckLogin';
    const res = await firstValueFrom(this.httpService.post(url, loginData));

    const cookie = res.headers?.['set-cookie']?.[0].split(';').shift();
    console.log('🚀 ~ 获取Cookie成功 ~:', cookie);
    if (!cookie) {
      throw new HttpException(
        '登录失败，无法获取cookie',
        HttpStatus.UNAUTHORIZED,
      );
    }
    this.userService.updatePinanCookie(cookie);
    return {
      cookie,
      data: res.data as { data: { code: number; msg: string } },
    };
  }

  // 获取产码信息
  async getProductMessage(Cookie: string, page = 1, limit = 20) {
    console.log('🚀 ~ PinanService ~ getProductMessage ~ Cookie:', Cookie);

    const url = `https://g63a2.danimmp.net/api/ApiOrder/Yu_list_get?page=${page}&limit=${limit}`;
    const { data } = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          Cookie,
        },
      }),
    );
    console.log('🚀 ~ PinanService ~ getProductMessage ~ data:', typeof data);
    if (typeof data === 'string') {
      this.userService.updatePinanCookie('');
      throw new HttpException('请先登录', HttpStatus.UNAUTHORIZED);
    }

    return data;
    // .pipe(map((res) => res.data));
  }
}
