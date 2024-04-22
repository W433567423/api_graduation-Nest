import { Injectable } from '@nestjs/common';

@Injectable()
export class HfsService {
  async uploadDataSet(file: Express.Multer.File, fileName: string) {
    console.log(file, fileName);
  }
}
