import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PinanService {
  constructor(private readonly httpService: HttpService) {}

  async getProductMessage() {
    const url =
      'https://g63a2.danimmp.net/api/ApiOrder/Yu_list_get?page=1&limit=10&orderid=&accid=&money=&status=';
    const { data } = await firstValueFrom(this.httpService.get(url));
    return data;
    // .pipe(map((res) => res.data));
  }
}
