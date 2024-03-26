import * as fs from 'fs';
import { join } from 'path';
export const workSpaceFolder = join(__dirname, '../.work_space');
export const workSpaceFolderJs = join(__dirname, '../.work_space/js');
export const workSpaceFolderPy = join(__dirname, '../.work_space/py');
export const initFolder = async (path: string) => {
  try {
    await fs.promises.stat(path);
  } catch (e) {
    // 不存在文件夹，直接创建 {recursive: true} 这个配置项是配置自动创建多个文件夹
    console.log(`工作区目录不存在,创建---${path}`);
    await fs.promises.mkdir(path, { recursive: true });
  }
};
export const init = () => {
  console.log('初始化创建工作区目录');

  initFolder(workSpaceFolder);
  initFolder(workSpaceFolderJs);
  initFolder(workSpaceFolderPy);
};
