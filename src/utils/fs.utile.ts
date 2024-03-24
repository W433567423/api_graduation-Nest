import { IFileType } from '@/modules/file/dtos/workSpace.req.dto';
import * as fs from 'fs';
// 文件夹是否存在，不存在则创建
const isExistDir = (path: string, autoCreate = true) => {
  const isExistDir = fs.existsSync(path);
  if (!isExistDir && autoCreate) {
    fs.mkdirSync(path);
  }
  return isExistDir;
};
// 创建文件
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

// 根据文件后缀名获取mimetype
const getMimeType = (fileName: string): IFileType => {
  if (fileName.includes('.')) {
    switch (fileName.split('.').pop()) {
      case 'jpg':
        return IFileType['image/jpeg'];
      case 'png':
        return IFileType['image/png'];
      default:
        return IFileType[''];
    }
  } else {
    return IFileType[''];
  }
};

export { getMimeType, isExistDir, touchFile };
