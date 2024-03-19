import * as fs from 'fs';
import { join } from 'path';
export const workSpaceFolder = join(__dirname, '../.work_spcae');
export const init = async () => {
  console.log('初始化创建工作区');
  try {
    await fs.promises.stat(workSpaceFolder);
  } catch (e) {
    // 不存在文件夹，直接创建 {recursive: true} 这个配置项是配置自动创建多个文件夹
    console.log('工作区目录不存在,创建工作区文件夹');
    await fs.promises.mkdir(workSpaceFolder, { recursive: true });
  }
};
