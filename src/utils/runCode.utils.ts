import { spawn } from 'child_process';
import { join } from 'path';

import { NodeVM, VMScript } from 'vm2';
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

const runInnerProject = async () => {
  return new Promise((resolve, rejects) => {
    let result = '';
    const cwd = join(__dirname, '../../out_code/Diabetic-Rredict/');
    const py = spawn(
      'python',
      [`${join(__dirname, '../../out_code/Diabetic-Rredict/script.py')}`],
      { cwd: cwd },
    );
    py.stdout.on('data', (res) => {
      result = res.toString();
    });
    py.stderr.on('data', (res) => {
      rejects(res.toString());
    });
    py.on('close', (code) => {
      resolve(result);
      console.log(`子进程退出：退出代码code ${code}`);
    });
  });
};
export { runCode, runInnerProject, type returnRunCodeData };
