import { IS_DEV } from '@/scripts/beforeNest';
import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { emptyDirSync } from 'fs-extra';
import { decode } from 'iconv-lite';
import xlsx from 'node-xlsx';
import { join } from 'path';
import { SocketsGateway } from '../sockets/sockets.gateway';

@Injectable()
export class DrwbncfService {
  constructor(private readonly socketsGateway: SocketsGateway) {}
  rootPath = join(__dirname, '../../../outCode/DRWBNCF');
  runPath = join(this.rootPath, 'runs/global-10-fold/Fdataset/WBNCF');

  // 运行Drwbncf项目
  async runDrwbncf() {
    const cb = this.socketsGateway.sendMessageToClient.bind(
      this.socketsGateway,
    );
    if (existsSync(this.runPath)) emptyDirSync(this.runPath);

    try {
      if (existsSync(this.runPath)) emptyDirSync(this.runPath);
    } catch {
      return { msg: 'DRWBNCF项目不存在', data: false };
    }
    const py = spawn('python3.8', [join(this.rootPath, 'main.py')], {
      cwd: this.rootPath,
    });
    py.stdout.on('data', (res) => {
      if (IS_DEV) cb(decode(res, 'cp936').toString(), true);
      else cb(res.toString(), true);
    });
    py.stderr.on('data', (res) => {
      if (IS_DEV) cb(decode(res, 'cp936').toString(), true);
      else cb(res.toString(), true);
    });
    py.on('close', (code) => {
      console.log(`子进程退出：退出代码code ${code}`);
      cb('tutu~end');
    });

    return { msg: '代码运行成功', data: true };
  }
  // 解析excel表格
  async parseExcel() {
    try {
      const logPath = join(this.runPath, readdirSync(this.runPath).pop()!);
      const res = readdirSync(logPath).find((e) => e.includes('fold.xlsx'))!;
      const filePath = join(logPath, res);
      console.log('🚀 ~ res:', filePath);
      const workSheet = xlsx.parse(filePath);
      return workSheet.shift()!.data;
    } catch {
      return null;
    }
  }
}
