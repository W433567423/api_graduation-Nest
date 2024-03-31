import { drwbncfRootPath } from '@/utils/joinWorkPath';
import { spawn } from 'child_process';
import { decode } from 'iconv-lite';
import { join } from 'path';

export const runDrwbncf = async (
  cb: (msg: string, noConsole?: boolean) => void,
) => {
  const rootPath = drwbncfRootPath();
  const py = spawn('python', [join(rootPath, 'main.py')], {
    cwd: rootPath,
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
};
