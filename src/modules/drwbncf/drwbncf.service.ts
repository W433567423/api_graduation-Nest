import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { existsSync, promises } from 'fs';
import { emptyDirSync } from 'fs-extra';
import { decode } from 'iconv-lite';
import xlsx from 'node-xlsx';
import { join } from 'path';
import { SocketsGateway } from '../sockets/sockets.gateway';

@Injectable()
export class DrwbncfService {
  constructor(private readonly socketsGateway: SocketsGateway) {}
  rootPath = join(__dirname, '../../outCode/DRWBNCF');
  runPath = join(this.rootPath, 'runs/global-10-fold/Fdataset/WBNCF');

  // 运行Drwbncf项目
  async runDrwbncf() {
    const cb = this.socketsGateway.sendMessageToClient.bind(
      this.socketsGateway,
    );
    try {
      if (existsSync(this.runPath)) emptyDirSync(this.runPath);
    } catch {
      return { msg: 'DRWBNCF项目不存在', data: false };
    }
    const py = spawn('python', [join(this.rootPath, 'main.py')], {
      cwd: this.rootPath,
    });
    py.stdout.on('data', (res) => {
      cb(decode(res, 'cp936').toString(), true);
    });
    py.stderr.on('data', (res) => {
      cb(decode(res, 'cp936').toString(), true);
    });
    py.on('close', (code) => {
      console.log(`子进程退出：退出代码code ${code}`);
      cb('tutu~end');
    });

    return { msg: '代码运行成功', data: true };
  }
  // 解析excel表格
  async parseExcel() {
    const logPath = join(
      this.runPath,
      (await promises.readdir(this.runPath)).pop()!,
    );
    const res = (await promises.readdir(logPath)).find((e) =>
      e.includes('fold.xlsx'),
    )!;
    const filePath = join(logPath, res);
    console.log('🚀 ~ res:', filePath);
    const workSheet = xlsx.parse(filePath);
    return workSheet.shift()!.data;
  }
}
