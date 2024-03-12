import {
  COS_BUCKET_NAME,
  COS_BUCKET_REGION,
  COS_SECRET_ID,
  COS_SECRET_KEY,
} from '@/config/secret.config';
import { CosError, UploadFileResult } from 'cos-nodejs-sdk-v5';
import { createHash } from 'crypto';
import dayjs from 'dayjs';
import * as fs from 'fs';
import { type ICosConfig } from './index';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const COS = require('cos-nodejs-sdk-v5');

const cos = new COS({
  SecretId: COS_SECRET_ID,
  SecretKey: COS_SECRET_KEY,
});

const md5Password = (password: string) => {
  // 仅能对字符串进行加密
  return createHash('md5').update(password).digest('hex');
};

const uploadFile = async (config: ICosConfig) => {
  return await new Promise((resolve, reject) => {
    cos.uploadFile(
      {
        Bucket: COS_BUCKET_NAME /* 填入您自己的存储桶，必须字段 */,
        Region:
          COS_BUCKET_REGION /* 存储桶所在地域，例如 ap-beijing，必须字段 */,
        ...config,
        SliceSize:
          1024 * 1024 * 5 /* 触发分块上传的阈值，超过5MB使用分块上传，非必须 */,
      },
      (err: CosError, data: UploadFileResult) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      },
    );
  });
};

const mkdirUpload = async () => {
  try {
    await fs.promises.stat('src/../.uploads');
  } catch (e) {
    // 不存在文件夹，直接创建 {recursive: true} 这个配置项是配置自动创建多个文件夹
    console.log('创建uploads文件夹');
    await fs.promises.mkdir('src/../.uploads', { recursive: true });
  }
};
// 产生随机图片名称
const createPicName = (preStr?: string, appendStr?: string) => {
  return (preStr ?? '') + String(dayjs().second()) + (appendStr ?? '');
};
export { createPicName, md5Password, mkdirUpload, uploadFile };
