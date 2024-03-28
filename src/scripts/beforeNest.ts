import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
export const workSpaceFolder = join(__dirname, '../../.work_space');
export const workSpaceFolderJs = join(__dirname, '../../.work_space/js');
export const workSpaceFolderPy = join(__dirname, '../../.work_space/py');
export const initFolder = async (logger: Logger, path: string) => {
  try {
    logger.log(`工作区目录已存在---${path}`);
    await fs.promises.stat(path);
  } catch (e) {
    // 不存在文件夹，直接创建 {recursive: true} 这个配置项是配置自动创建多个文件夹
    logger.log(`工作区目录不存在,创建---${path}`);
    fs.mkdir(path, () => {
      logger.log('创建成功');
    });
  }
};
export const init = () => {
  const logger = new Logger();
  logger.log('初始化创建工作区目录');

  initFolder(logger, workSpaceFolder);
  initFolder(logger, workSpaceFolderJs);
  initFolder(logger, workSpaceFolderPy);
};
