import { workSpaceFolder } from '@/scripts/beforeNest';
import { join } from 'path';

export const joinWorkPath = (rootFolderName: string) => {
  return join(workSpaceFolder, rootFolderName);
};

export const drwbncfRootPath = () => {
  const path = join(__dirname, '../../outCode/DRWBNCF');
  return path;
};
