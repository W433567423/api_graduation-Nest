import * as fs from 'fs';
const isExistDir = (path: string, autoCreate = true) => {
  const isExistDir = fs.existsSync(path);
  if (!isExistDir && autoCreate) {
    fs.mkdirSync(path);
  }
  return isExistDir;
};

export { isExistDir };
