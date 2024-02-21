import { NodeVM, VMScript } from 'vm2';
interface retrunRunCodeData {
  success: boolean;
  data: Array<string> | Error;
}

const runJavaScript = async (code: string) => {
  const data: retrunRunCodeData = {
    success: true,
    data: [],
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
    data.data = e;
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
export { runCode, type retrunRunCodeData };
