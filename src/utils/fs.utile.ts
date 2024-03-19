import * as fs from 'fs';
// 文件夹是否存在，不存在则创建
const isExistDir = (path: string, autoCreate = true) => {
  const isExistDir = fs.existsSync(path);
  if (!isExistDir && autoCreate) {
    fs.mkdirSync(path);
  }
  return isExistDir;
};
const touchFile = async (path: string) => {
  return new Promise((resolve, rejects) => {
    fs.writeFile(path, '', (error) => {
      if (error) {
        // 创建失败
        rejects(`创建失败：${error}`);
      } else {
        // 创建成功
        resolve('创建成功！');
      }
    });
  });
};

export { isExistDir, touchFile };
