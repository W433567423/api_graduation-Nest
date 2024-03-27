import { spawn } from 'child_process';

import { join } from 'path';
import { Observable } from 'rxjs';
import { NodeVM, VMScript } from 'vm2';
import { joinWorkPath } from './joinWorkPath';
interface returnRunCodeData {
  success: boolean;
  data: Array<string>;
  error: Error;
}

// 运行js代码
const runJavaScript = async (code: string) => {
  const data: returnRunCodeData = {
    success: true,
    data: [],
    error: new Error(),
  };
  const curCode = code.replaceAll('console.log', 'tutu_result.push');

  const vm = new NodeVM({ console: 'off' });
  vm.setGlobal('tutu_result', []);

  const script = new VMScript(curCode);

  try {
    vm.run(script);
    data.data = vm.getGlobal('tutu_result');
  } catch (e) {
    data.success = false;
    data.error.name = e.name;
    data.error.message = e.message;
    data.error.stack = e.stack;
  }

  return data;
};

// 运行代码
const runCode = async (code: string, type: string) => {
  switch (type) {
    case 'JavaScript':
      return await runJavaScript(code);
    default:
      return await runJavaScript(code);
  }
};

const runInnerProject = (indexFile: string) => {
  const index = joinWorkPath(indexFile);
  const cwd = joinWorkPath(join(...indexFile.split('\\').slice(0, -1)));
  console.log('🚀 ~ runInnerProject ~ cwd:', cwd);

  const observable = new Observable((subscriber) => {
    const py = spawn('python', [index], { cwd });
    py.stdout.on('data', (res) => {
      subscriber.next({ data: res.toString() });
    });
    py.stderr.on('data', (res) => {
      subscriber.next({ data: res.toString() });
    });
    py.on('close', (code) => {
      console.log(`子进程退出：退出代码code ${code}`);
      subscriber.complete();
    });
  });
  return observable;

  // return new Promise((resolve, rejects) => {

  //   resolve(
  //     new Observable((observer) => {
  //       let result = '';
  //       const py = spawn('python', [index], { cwd });
  //       py.stdout.on('data', (res) => {
  //         console.log('🚀 ~ py.stdout.on ~ res.toString():', res.toString());
  //         result = res.toString();
  //         observer.next({ data: { msg: res.toString() } });
  //       });
  //       py.stderr.on('data', (res) => {
  //         console.log('🚀 ~ py.stderr.on ~ res.toString():', res.toString());
  //         rejects(res.toString());
  //       });
  //       py.on('close', (code) => {
  //         resolve(result);
  //         console.log(`子进程退出：退出代码code ${code}`);
  //       });
  //     }),
  //   );
  // });
};
export { runCode, runInnerProject, type returnRunCodeData };
