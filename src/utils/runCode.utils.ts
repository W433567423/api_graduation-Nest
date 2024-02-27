import { NodeVM, VMScript } from 'vm2';
interface returnRunCodeData {
  success: boolean;
  data: Array<string>;
  error: Error;
}

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

const runCode = async (code: string, type: string) => {
  switch (type) {
    case 'JavaScript':
      return await runJavaScript(code);
    default:
      return await runJavaScript(code);
  }
};
export { runCode, type returnRunCodeData };
