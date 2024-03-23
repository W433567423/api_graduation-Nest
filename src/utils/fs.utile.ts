import * as fs from 'fs';
// 文件夹是否存在，不存在则创建
const isExistDir = (path: string, autoCreate = true) => {
  const isExistDir = fs.existsSync(path);
  if (!isExistDir && autoCreate) {
    fs.mkdirSync(path);
  }
  return isExistDir;
};
const touchFile = async (path: string): Promise<string> => {
  return new Promise((resolve, rejects) => {
    try {
      fs.writeFileSync(path, '');
      resolve('文件创建成功');
    } catch (e) {
      rejects(`文件创建失败,${String(e)}`);
    }
  });
};

export { isExistDir, touchFile };
