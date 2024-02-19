import { NodeVM, VMScript } from 'vm2';

const runJavaScript = async (code: string) => {
  const vm = new NodeVM();
  const script = new VMScript(code);
  const a = vm.run(script);
  console.log(11111, a);

  // return { success: true, data: vm.run(script) };
};

const runCode = async (code: string, type: string) => {
  switch (type) {
    case 'JavaScript':
      return await runJavaScript(code);
  }
};
export { runCode };
