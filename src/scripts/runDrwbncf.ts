import { drwbncfRootPath } from '@/utils/joinWorkPath';
import { spawn } from 'child_process';
import path from 'path';

export const runDrwbncf = async (cb: (msg: string) => void) => {
  const rootPath = drwbncfRootPath();
  const py = spawn('python', [path.join(rootPath, 'main.ts')], {
    cwd: rootPath,
  });
  py.stdout.on('data', (res) => {
    cb(res.toString());
  });
  py.stderr.on('data', (res) => {
    console.log('🚀 ~ py.stderr.on ~ res.toString():', res.toString());
  });
  py.on('close', (code) => {
    console.log(`子进程退出：退出代码code ${code}`);
    cb('tutu~end');
  });
};
